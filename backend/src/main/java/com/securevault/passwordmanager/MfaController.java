package com.securevault.passwordmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.securevault.passwordmanager.User.User;
import com.securevault.passwordmanager.User.UserRepository;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrDataFactory;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.recovery.RecoveryCodeGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;

@CrossOrigin(origins = "http://localhost:3000")
@Controller
public class MfaController {
    private static Base64 base64Codec = new Base64();

    @Autowired 
    private UserRepository userRepository;

    @GetMapping("/mfa/setup")
    public ResponseEntity<Map<String, String>> setupDevice() throws QrGenerationException {
        // Generate the secret
        SecretGenerator secretGenerator = new DefaultSecretGenerator();
        String secret = secretGenerator.generate();

        QrData data = new QrData.Builder()
            .label("example@example.com")
            .secret(secret)
            .issuer("Secure-Vault")
            .build();

        QrGenerator generator = new ZxingPngQrGenerator();

        // Generate the QR code image data as a base64 string which
        // can be used in an <img> tag:
        byte[] qrCodeData = generator.generate(data);
        String mimeType = generator.getImageMimeType();
        String encodedData = new String(base64Codec.encode(qrCodeData));

        Map<String, String> response = new HashMap<>();
        response.put("qrCode", "data:" + mimeType + ";base64," + encodedData);
        response.put("secret", secret);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/mfa/verify")
    @ResponseBody
        public String verify(@RequestParam String code, @RequestParam String email) {
        User user = userRepository.findByEmail(email);

        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);

        if (verifier.isValidCode(user.getTotpSecret(), code)) {
            return "success";
        }

        return "incorrect code";
    }
    
}
