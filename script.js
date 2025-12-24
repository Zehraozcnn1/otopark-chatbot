const tg = window.Telegram.WebApp;
tg.expand(); // Sayfayı tam ekran aç

document.getElementById('authBtn').addEventListener('click', async () => {
    // Tarayıcı parmak izini destekliyor mu kontrol et
    if (!window.PublicKeyCredential) {
        alert("Cihazınız biyometrik doğrulamayı desteklemiyor.");
        return;
    }

    // Basit bir WebAuthn yapılandırması (Test amaçlı)
    const options = {
        publicKey: {
            challenge: new Uint8Array([1, 2, 3, 4]), // Sunucudan gelen rastgele veri
            rp: { name: "Otopark Sistemi" },
            user: {
                id: new Uint8Array([123]),
                name: "user@park.com",
                displayName: "Resident"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: { userVerification: "required" },
            timeout: 60000
        }
    };

    try {
        // Cihazın parmak izi/yüz tanıma ekranını açar
        const credential = await navigator.credentials.create(options);
        
        // Başarılı olursa Telegram bota veri gönderir
        tg.sendData(JSON.stringify({
            status: "success",
            message: "Parmak izi doğrulandı"
        }));
        
        tg.close(); // İşlem bitince WebApp'i kapat
    } catch (err) {
        console.error("Doğrulama hatası:", err);
        alert("Doğrulama başarısız veya iptal edildi.");
    }
});