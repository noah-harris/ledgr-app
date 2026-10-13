CREATE FUNCTION [dbo].[f_Check_isSupportedImageExtension] (@FileExtension NVARCHAR(255))
RETURNS BIT
AS
BEGIN
	DECLARE @isSupportedImageExtension BIT = (SELECT [isSupportedImageExtension] FROM [dim].[FileExtension] WHERE FileExtension = @FileExtension)
	RETURN @isSupportedImageExtension
END