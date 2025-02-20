// Article for reference: https://medium.com/@ankithahjpgowda/access-amazon-s3-bucket-from-java-springboot-bf8c214f015d

package com.securevault.passwordmanager;

import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.PresignedUrlDownloadRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.net.URL;
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping("/file")
public class BucketController {
    
    @Autowired
    BucketService bucketService;

    @GetMapping("/downloadAll")
    public @ResponseBody HashMap<String, String> getAllFiles(@RequestParam("bucketName") String bucketName) throws Exception {
        return bucketService.getAllObjectsFromBucket(bucketName);
    }

    @PostMapping("/upload")
    public void uploadObject(@RequestParam("bucketName") String bucketName, @RequestParam("objName") String objName) throws Exception {
        bucketService.putObjectIntoBucket(bucketName, objName,"opt/test/v1/uploadfile.txt");
    }
}
