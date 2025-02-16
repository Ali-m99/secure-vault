// Article for reference: https://medium.com/@ankithahjpgowda/access-amazon-s3-bucket-from-java-springboot-bf8c214f015d

package com.securevault.passwordmanager;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.net.URL;
import java.util.Date;

@Service
public class BucketService {
    @Autowired
    AmazonS3 s3Client;

    public List<Bucket> getBucketList() {
        return s3Client.listBuckets();
    }

    public boolean validateBucket(String bucketName) {
        List<Bucket> bucketList = getBucketList();
        return bucketList.stream().anyMatch(m -> bucketName.equals(m.getName()));
    }

    // Returns a pre-signed URL to the object instead of the actual content for the
    // object
    public String getObjectFromBucket(String bucketName, String objectName) throws IOException {
        // Logic to generate the presigned URL
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60; // 1 hour
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName,
                objectName)
                .withMethod(com.amazonaws.HttpMethod.GET)
                .withExpiration(expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    public void createBucket(String bucketName) {
        s3Client.createBucket(bucketName);
    }

    public void putObjectIntoBucket(String bucketName, String objectName, String filePathToUpload) {
        try {
            s3Client.putObject(bucketName, objectName, new File(filePathToUpload));
        } catch (AmazonServiceException e) {
            System.err.println(e.getErrorMessage());
            System.exit(1);
        }
    }

}
