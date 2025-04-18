// Article for reference: https://medium.com/@ankithahjpgowda/access-amazon-s3-bucket-from-java-springboot-bf8c214f015d
package com.securevault.passwordmanager.S3;

import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.PresignedUrlDownloadRequest;
import com.securevault.passwordmanager.FileInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("/file")
// @CrossOrigin(origins = "http://localhost:3000")
public class BucketController {
    
    @Autowired
    BucketService bucketService;

    @GetMapping("/downloadAll")
    public @ResponseBody List<FileInfo> getAllFiles(@RequestParam String userId) throws Exception {
        String bucketName = "sv-p" + userId;
        return bucketService.getAllObjectsFromBucket(bucketName);
    }

    @GetMapping("/count")
    public @ResponseBody int getFileCount(@RequestParam String userId) {
        String bucketName = "sv-p" + userId;
        return bucketService.getObjectCount(bucketName);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteObject(@RequestParam String userId, @RequestParam String fileName) throws Exception {
        String bucketName = "sv-p" + userId;
        bucketService.deleteObject(bucketName, fileName);
        return ResponseEntity.ok("File deleted successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadObject(@RequestParam String userId, @RequestParam String fileName, @RequestParam("file") MultipartFile file) throws Exception {
        String bucketName = "sv-p" + userId;
        bucketService.putObjectIntoBucket(bucketName, fileName, file);
        return ResponseEntity.ok("File uploaded successfully");
    }

    @PostMapping("/createFolder")
    public ResponseEntity<String> createFolder(@RequestParam String userId, @RequestParam String folderName) throws Exception {
        String bucketName = "sv-p" + userId;
        bucketService.createFolderInBucket(bucketName, folderName);
        return ResponseEntity.ok("Folder created successfully");
    }
}
