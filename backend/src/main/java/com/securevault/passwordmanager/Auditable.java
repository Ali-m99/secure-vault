package com.securevault.passwordmanager;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Auditable {

    private Long lastModifiedTime;
    private Long dateCreated;

    public Long getLastModifiedTime() {
        return lastModifiedTime;
    }
    public void setLastModifiedTime(Long lastModifiedTime) {
        this.lastModifiedTime = lastModifiedTime;
    }
    public Long getDateCreated() {
        return dateCreated;
    }
    public void setDateCreated(Long dateCreated) {
        this.dateCreated = dateCreated;
    }
}
