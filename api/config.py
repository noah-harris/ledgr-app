import os

USERNAME = os.getenv("DB_USERNAME")
PASSWORD = os.getenv("DB_PASSWORD")
EXTERNAL_PORT = os.getenv("EXTERNAL_PORT")
EXTERNAL_HOST= os.getenv("EXTERNAL_HOST")
API_SECRET_KEY = os.getenv("API_SECRET_KEY")
GOOGLE_EMAIL = os.getenv("GOOGLE_EMAIL")
API_INTERNAL_PORT = os.getenv("API_INTERNAL_PORT")

GOOGLE_CREDENTIALS = {
    "installed": {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "project_id": "ledgr-502912",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uris": [
            "http://localhost"
        ]
    }
}


