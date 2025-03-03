// Article for reference: https://medium.com/@ankithahjpgowda/access-amazon-s3-bucket-from-java-springboot-bf8c214f015d

package com.securevault.passwordmanager.S3;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.securevault.passwordmanager.FileInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

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
    public String getPreSignedURL(String bucketName, String fileName) throws IOException {
        // Logic to generate the presigned URL
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60; // 1 hour
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName,
                fileName)
                .withMethod(com.amazonaws.HttpMethod.GET)
                .withExpiration(expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    // public HashMap<String, String> getAllObjectsFromBucket(String bucketName) throws IOException {
    //      HashMap<String, String> bucketFiles = new HashMap<>();

    //     // List all objects in the bucket
    //     ListObjectsV2Request request = new ListObjectsV2Request().withBucketName(bucketName);
    //     ListObjectsV2Result result;
        
    //     do {
    //         result = s3Client.listObjectsV2(request);
    //         for (S3ObjectSummary objectSummary : result.getObjectSummaries()) {
    //             String fileName = objectSummary.getKey();
    //             bucketFiles.put(getPreSignedURL(bucketName, fileName), fileName);
    //         }
    //         request.setContinuationToken(result.getNextContinuationToken());
    //     } while (result.isTruncated());

    //     return bucketFiles;
    // }

    public List<FileInfo> getAllObjectsFromBucket(String bucketName) throws IOException {
        List<FileInfo> bucketFiles = new ArrayList<>();
    
        ListObjectsV2Request request = new ListObjectsV2Request().withBucketName(bucketName);
        ListObjectsV2Result result;
    
        do {
            result = s3Client.listObjectsV2(request);
            for (S3ObjectSummary objectSummary : result.getObjectSummaries()) {
                String preSignedUrl = getPreSignedURL(bucketName, objectSummary.getKey());
                bucketFiles.add(new FileInfo(preSignedUrl, objectSummary.getKey(), objectSummary.getLastModified()));
            }
            request.setContinuationToken(result.getNextContinuationToken());
        } while (result.isTruncated());
    
        return bucketFiles;
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
