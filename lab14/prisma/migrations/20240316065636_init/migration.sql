BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AUDITORIUM] (
    [AUDITORIUM] NCHAR(10) NOT NULL,
    [AUDITORIUM_NAME] NVARCHAR(200),
    [AUDITORIUM_CAPACITY] INT,
    [AUDITORIUM_TYPE] NCHAR(10) NOT NULL,
    CONSTRAINT [PK__AUDITORI__5372601027012E5F] PRIMARY KEY CLUSTERED ([AUDITORIUM])
);

-- CreateTable
CREATE TABLE [dbo].[AUDITORIUM_TYPE] (
    [AUDITORIUM_TYPE] NCHAR(10) NOT NULL,
    [AUDITORIUM_TYPENAME] NVARCHAR(30) NOT NULL,
    CONSTRAINT [AUDITORIUM_TYPE_PK] PRIMARY KEY CLUSTERED ([AUDITORIUM_TYPE])
);

-- CreateTable
CREATE TABLE [dbo].[FACULTY] (
    [FACULTY] NCHAR(10) NOT NULL,
    [FACULTY_NAME] NVARCHAR(50),
    CONSTRAINT [PK_FACULTY] PRIMARY KEY CLUSTERED ([FACULTY])
);

-- CreateTable
CREATE TABLE [dbo].[PULPIT] (
    [PULPIT] NCHAR(10) NOT NULL,
    [PULPIT_NAME] NVARCHAR(100),
    [FACULTY] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_PULPIT] PRIMARY KEY CLUSTERED ([PULPIT])
);

-- CreateTable
CREATE TABLE [dbo].[SUBJECT] (
    [SUBJECT] NCHAR(10) NOT NULL,
    [SUBJECT_NAME] NVARCHAR(50) NOT NULL,
    [PULPIT] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_SUBJECT] PRIMARY KEY CLUSTERED ([SUBJECT])
);

-- CreateTable
CREATE TABLE [dbo].[TEACHER] (
    [TEACHER] NCHAR(10) NOT NULL,
    [TEACHER_NAME] NVARCHAR(50),
    [PULPIT] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TEACHER] PRIMARY KEY CLUSTERED ([TEACHER])
);

-- AddForeignKey
ALTER TABLE [dbo].[AUDITORIUM] ADD CONSTRAINT [FK__AUDITORIU__AUDIT__440B1D61] FOREIGN KEY ([AUDITORIUM_TYPE]) REFERENCES [dbo].[AUDITORIUM_TYPE]([AUDITORIUM_TYPE]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PULPIT] ADD CONSTRAINT [FK_PULPIT_FACULTY] FOREIGN KEY ([FACULTY]) REFERENCES [dbo].[FACULTY]([FACULTY]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SUBJECT] ADD CONSTRAINT [FK_SUBJECT_PULPIT] FOREIGN KEY ([PULPIT]) REFERENCES [dbo].[PULPIT]([PULPIT]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TEACHER] ADD CONSTRAINT [FK_TEACHER_PULPIT] FOREIGN KEY ([PULPIT]) REFERENCES [dbo].[PULPIT]([PULPIT]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
