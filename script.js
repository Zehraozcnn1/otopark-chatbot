const tg = window.Telegram.WebApp;
tg.expand();

document.getElementById('authBtn').addEventListener('click', async () => {
    // Tarayıcı kontrolü
    if (!window.PublicKeyCredential) {
        alert("Cihazınız biyometrik doğrulamayı desteklemiyor.");
        return;
    }

    // Face ID / Parmak İzi sensörü var mı?
    const isBiometricAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    
    if (!isBiometricAvailable) {
        alert("Face ID veya Parmak İzi sensörü hazır değil. Lütfen ekran kilidinizin aktif olduğundan emin olun.");
        return;
    }

    const options = {
        publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)), // Daha güvenli rastgele veri
            rp: { name: "Otopark Sistemi", id: window.location.hostname },
            user: {
                id: crypto.getRandomValues(new Uint8Array(16)),
                name: "sakin@otopark.com",
                displayName: "Site Sakini"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
            authenticatorSelection: {
                authenticatorAttachment: "platform", // Cihazın kendi sensörünü (FaceID/TouchID) zorlar
                userVerification: "required"
            },
            timeout: 60000
        }
    };

    try {
        const credential = await navigator.credentials.create(options);
        // Başarılı olursa Telegram'a haber ver
        tg.sendData(JSON.stringify({ status: "success", method: "biometric" }));
        tg.close();
    } catch (err) {
        console.error(err);
        alert("Doğrulama hatası: " + err.message);
    }
});
