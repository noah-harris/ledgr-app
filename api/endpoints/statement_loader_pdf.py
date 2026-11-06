from ._imports import *
from statement_loader.loader import auto_columns, page_chars, text_lines, find_anchor, extract


def open_pdf(idFile:UUID, user:Users):
    """ Open one of the user's files with pdfplumber. Use it as a context manager. """
    result = exec(
        statement="SELECT * FROM [usr].[v_File] WHERE [idUsers] = :idUsers AND [idFile] = :idFile",
        database="ldr",
        parameters={"idUsers": user.idUsers, "idFile": idFile}
    )
    path = Path(FileView(**result[0]).ContainerFilePath) if result else None
    if path is None or not path.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "File not found")
    try:
        return pdfplumber.open(path)
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "That file isn't a readable PDF")


def page_of(pdf, n:int):
    if not 1 <= n <= len(pdf.pages):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No such page")
    return pdf.pages[n - 1]


@app.get("/statement/loader/pdf", status_code=200)
def get_statement_pdf(idFile:UUID, current_user:Users=Depends(get_current_user)):
    with open_pdf(idFile, current_user) as pdf:
        pages = [{"width": float(p.width), "height": float(p.height), "has_text": bool(p.chars)} for p in pdf.pages]
    return {"id": idFile, "pages": pages}


@app.get("/statement/loader/pdf/page", status_code=200)
def get_statement_pdf_page(idFile:UUID, n:int, current_user:Users=Depends(get_current_user)):
    with open_pdf(idFile, current_user) as pdf:
        img = page_of(pdf, n).to_image(resolution=144).original
    buf = BytesIO()
    img.save(buf, "PNG")
    return Response(buf.getvalue(), media_type="image/png", headers={"Cache-Control": "private, max-age=3600"})


@app.post("/statement/loader/pdf/columns", status_code=200)
def get_statement_pdf_columns(idFile:UUID, box:StatementLoaderBox, current_user:Users=Depends(get_current_user)):
    with open_pdf(idFile, current_user) as pdf:
        return auto_columns(page_of(pdf, box.page), box.x0, box.top, box.x1, box.bottom)


@app.post("/statement/loader/pdf/anchor", status_code=200)
def get_statement_pdf_anchor(idFile:UUID, anchor:StatementLoaderAnchor, current_user:Users=Depends(get_current_user)):
    with open_pdf(idFile, current_user) as pdf:
        lines = text_lines(page_chars(page_of(pdf, anchor.page)))
    y = find_anchor(lines, anchor.text, anchor.near_y)
    if y is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"“{anchor.text}” isn't on page {anchor.page}. Copy it exactly as printed, on one line.")
    return {"y": round(y, 2)}


@app.post("/statement/loader/pdf/extract", status_code=200)
def extract_statement_pdf(idFile:UUID, body:StatementLoaderExtract, current_user:Users=Depends(get_current_user)):
    with open_pdf(idFile, current_user) as pdf:
        try:
            return extract(pdf, body.layout, body.overrides, body.transforms, body.preview_page)
        except (ValueError, KeyError) as e:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Layout problem: {e}")
