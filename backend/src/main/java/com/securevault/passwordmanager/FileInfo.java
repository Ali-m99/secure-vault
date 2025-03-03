package com.securevault.passwordmanager;

import java.util.Date;

// Class to store data about S3 files in one object
public class FileInfo {
    private String preSignedUrl;
    private String fileName;
    private Date lastModified;

    public FileInfo(String preSignedUrl, String fileName, Date lastModified) {
        this.preSignedUrl = preSignedUrl;
        this.fileName = fileName;
        this.lastModified = lastModified;
    }

    public String getPreSignedUrl() { return preSignedUrl; }
    public String getFileName() { return fileName; }
    public Date getLastModified() { return lastModified; }
}
