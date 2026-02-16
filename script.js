const face1Input = document.getElementById("face1");
const face2Input = document.getElementById("face2");
const statusText = document.getElementById("status");
const resultDiv = document.getElementById("result");

// Preview images before upload
face1Input.addEventListener("change", () => previewImage(face1Input, "preview1"));
face2Input.addEventListener("change", () => previewImage(face2Input, "preview2"));

function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        let preview = document.getElementById(previewId);
        if (!preview) {
            preview = document.createElement("img");
            preview.id = previewId;
            preview.style.marginTop = "10px";
            preview.style.maxWidth = "100%";
            preview.style.borderRadius = "10px";
            input.parentNode.insertBefore(preview, input.nextSibling);
        }
        preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function swapFaces() {
    const file1 = face1Input.files[0];
    const file2 = face2Input.files[0];

    if (!file1 || !file2) {
        statusText.style.color = "red";
        statusText.innerText = "Please upload both images.";
        return;
    }

    statusText.style.color = "blue";
    statusText.innerText = "Uploading and processing...";
    resultDiv.innerHTML = "";

    const formData = new FormData();
    formData.append("face1", file1);
    formData.append("face2", file2);

    try {
        const response = await fetch("https://your-backend-api.com/swap", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        if (data.imageUrl) {
            statusText.style.color = "green";
            statusText.innerText = "Face swap complete!";

            const img = document.createElement("img");
            img.src = data.imageUrl;
            img.alt = "Swapped Result";
            img.style.marginTop = "20px";
            img.style.width = "100%";
            img.style.borderRadius = "12px";

            resultDiv.appendChild(img);
        } else {
            throw new Error("Invalid response");
        }

    } catch (error) {
        statusText.style.color = "red";
        statusText.innerText = "Error connecting to server.";
        console.error(error);
    }
}
