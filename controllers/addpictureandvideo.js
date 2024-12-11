document.addEventListener('DOMContentLoaded', addpicture);

function addpicture() {
    const fInput = document.getElementById('fileInput');
    const pBar = document.getElementById('progressBar');
    const pText = document.getElementById('progressText');
    const fName = document.getElementById('fileName');
    const modal = document.getElementById('myModal');
    const cModal = document.getElementById('closeModal');
    const pContainer = document.getElementById('previewContainerUploadFile');
    const cBtn = document.getElementById('clearButton');

    fInput.addEventListener('change', handleFileChange);
    cModal.addEventListener('click', closeModal);
    cBtn.addEventListener('click', clearFields);
    window.addEventListener('click', handleWindowClick);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadstart = handleLoadStart;
            reader.onprogress = handleProgress;
            reader.onload = () => handleLoad(reader, file);
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
            fInput.value = '';
        }
    }

    function handleLoadStart() {
        pBar.style.width = '0%';
        pText.style.display = 'block';
        pText.innerText = '0%';
        pContainer.style.display = 'none';
        cBtn.style.display = 'none';
    }

    function handleProgress(event) {
        if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            pBar.style.width = `${progress}%`;
            pText.innerText = `${Math.round(progress)}%`;
        }
    }

    function handleLoad(reader, file) {
        const uploadTime = 4000;
        const interval = 50;
        const steps = uploadTime / interval;
        let currentStep = 0;

        function updateProgress() {
            const progress = (currentStep / steps) * 100;
            pBar.style.width = `${progress}%`;
            pText.innerText = `${Math.round(progress)}%`;
            currentStep++;

            if (currentStep <= steps) {
                setTimeout(updateProgress, interval);
            } else {
                pBar.style.width = '100%';
                pText.innerText = '100%';
                fName.innerText = `File Name: ${file.name}`;
                pContainer.innerHTML = `<img src="${reader.result}" alt="Preview" id="previewImage">`;
                pContainer.style.display = 'block';
                cBtn.style.display = 'block';
            }
        }

        setTimeout(updateProgress, interval);
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function clearFields() {
        fInput.value = '';
        pBar.style.width = '0%';
        pText.style.display = 'none';
        fName.innerText = '';
        pContainer.style.display = 'none';
        cBtn.style.display = 'none';
    }

    function handleWindowClick(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}