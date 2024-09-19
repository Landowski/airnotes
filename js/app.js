document.addEventListener('DOMContentLoaded', (event) => {
    const notesList = document.getElementById('notesList');
    const nothingHere = document.getElementById('nothingHere');
    const createNoteBtn = document.getElementById('createNoteBtn');
    const sidebarBtn = document.getElementById('sidebarBtn');
    const clearAllNotesBtn = document.getElementById('clearAllNotesBtn');
    const container = document.getElementById('container');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let offsetX, offsetY;

    function start() {
        const pegaTA = document.querySelectorAll('textarea');
        pegaTA.forEach(ta => {
            ta.style.height = ta.value.length ? `${ta.scrollHeight}px` : 'auto';
        });
    }

    setTimeout(start, 100);

    createNoteBtn.addEventListener('click', createNote);
    sidebarBtn.addEventListener('click', toggleSidebar);
    clearAllNotesBtn.addEventListener('click', clearAllNotes);

    function createNote() {
        const noteWidth = 250;
        const noteHeight = 110;
        const left = (window.innerWidth - noteWidth) / 2 + window.scrollX;
        const top = (window.innerHeight - noteHeight) / 2 + window.scrollY;
        const note = {
            id: Date.now(),
            content: '',
            position: { left: `${left}px`, top: `${top}px` }
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        renderSidebar();
        setTimeout(simulateHeaderClick, 100);
    }
    
    function renderNotes() {
        container.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.style.left = note.position.left;
            noteElement.style.top = note.position.top;
            noteElement.dataset.id = note.id;
            noteElement.innerHTML = `
                <div class="header">
                    <div class="trash"><i class="las la-trash-alt"></i></div>
                </div>
                <textarea placeholder="Enter your note here">${note.content}</textarea>
            `;
            container.appendChild(noteElement);

            const textarea = noteElement.querySelector('textarea');
            textarea.addEventListener('keyup', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });

            textarea.addEventListener('blur', () => updateNoteContent(note.id, textarea.value));

            noteElement.querySelector('.trash').addEventListener('click', () => deleteNote(note.id));

            noteElement.addEventListener('mousedown', mouseDown);

            let isDragging = false;

            function mouseDown(e) {
                if (e.target !== textarea) {
                    e.preventDefault()
                    isDragging = true;
                    mouseOver();
                    offsetX = e.clientX - noteElement.getBoundingClientRect().left;
                    offsetY = e.clientY - noteElement.getBoundingClientRect().top;
                    document.addEventListener('mousemove', mouseMove)
                    document.addEventListener('mouseup', mouseUp)
                }
            }

            function mouseMove(e) {
                e.preventDefault()
                isDragging = true;
                const left = e.pageX - offsetX;
                const top = e.pageY - offsetY;
                updateNotePosition(note.id, left, top);
            }

            function mouseUp(e) {
                e.preventDefault()
                isDragging = false;
                mouseOver();
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
            }

            function mouseOver() {
                if (isDragging) {
                    document.body.style.cursor = 'grabbing';
                } else {
                    document.body.style.cursor = 'grab';
                }
            }

        });

        adjustTextareaHeight();
    }

    function simulateHeaderClick() {
        const firstHeader = document.querySelector('.note .header');
        if (firstHeader) {
            const event = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            firstHeader.dispatchEvent(event);
            
            const upEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            firstHeader.dispatchEvent(upEvent);
        }
    }

    function adjustTextareaHeight() {
        const textareas = document.querySelectorAll('.note textarea');
        textareas.forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }

    function renderSidebar() {
        if (notes.length > 0) {
            notesList.innerHTML = '';
            nothingHere.style.display = 'none';
            notesList.style.display = 'block';
            notes.forEach(note => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${note.content.trim() === '' ? 'Empty' : note.content}</span>
                    <div>
                        <i class="las la-trash-alt trash" data-id="${note.id}"></i>
                        <i class="las la-map-marker locate" data-id="${note.id}"></i>
                    </div>
                `;
                notesList.appendChild(listItem);

                listItem.querySelector('.trash').addEventListener('click', (e) => {
                    const noteId = e.target.getAttribute('data-id');
                    deleteNote(Number(noteId));
                });

                listItem.querySelector('.locate').addEventListener('click', (e) => {
                    const noteId = e.target.getAttribute('data-id');
                    locateNote(Number(noteId));
                });
            });
        } else {
            notesList.style.display = 'none';
            nothingHere.style.display = 'block';
            nothingHere.textContent = 'Nothing here.';
        }
    }

    function locateNote(id) {
        const noteElement = document.querySelector(`.note[data-id="${id}"]`);
        if (noteElement) {
            const rect = noteElement.getBoundingClientRect();
            const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight) && 
                              (rect.left >= 0 && rect.right <= window.innerWidth);

            if (!isVisible) {
                noteElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }

            // Highlight the note briefly
            noteElement.style.transition = 'box-shadow 0.3s ease-in-out';
            noteElement.style.boxShadow = '0px 0px 25px 0px rgba(0,0,0,0.5)';
            setTimeout(() => {
                noteElement.style.boxShadow = '';
            }, 1500);
        }
    }

    function updateNoteContent(id, content) {
        notes = notes.map(note => note.id === id ? { ...note, content } : note);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderSidebar();
    }

    function updateNotePosition(id, left, top) {
        notes = notes.map(note => 
            note.id === id ? { ...note, position: { left: `${left}px`, top: `${top}px` } } : note
        );
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }

    function deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== id);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            renderSidebar();
        }
    }

    function clearAllNotes() {
        if (notes.length > 0) {
            if (confirm('Are you sure you want to delete all notes?')) {
                notes = [];
                localStorage.removeItem('notes');
                toggleSidebar();
                renderNotes();
                renderSidebar();
            }
        }
    }

    function toggleSidebar(){
        document.getElementById("sidebar").classList.toggle('active');
        renderSidebar();
    }

    renderNotes();
    renderSidebar();
    setTimeout(simulateHeaderClick, 100);
});