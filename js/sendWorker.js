document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formStatus = document.getElementById('formStatus');
    const submitButton = e.target.querySelector('button[type="submit"]');

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formStatus.textContent = '';

    try {
        const response = await fetch('https://contact-form-handler.proud-rice-6c6d.galin-yan5.workers.dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            formStatus.style.color = 'green';
            formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            e.target.reset();
        } else {
            formStatus.style.color = 'red';
            formStatus.textContent = result.error || 'Something went wrong. Please try again.';
        }

    } catch (error) {
        formStatus.style.color = 'red';
        formStatus.textContent = 'Network error. Please check your connection and try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
});