document.addEventListener('DOMContentLoaded', (event) => {
    const sidebar = document.getElementById('sidebar');
    const notesList = document.getElementById('notesList');
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
        setTimeout(simulateHeaderClick, 100);
    }
    
    function renderNotes() {
        container.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.style.left = note.position.left;
            noteElement.style.top = note.position.top;
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
        renderSidebar();
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
        notesList.innerHTML = '';
        notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>Note ${note.id}</span>
                <i class="las la-trash-alt" data-id="${note.id}"></i>
            `;
            notesList.appendChild(listItem);

            listItem.querySelector('i').addEventListener('click', (e) => {
                const noteId = e.target.getAttribute('data-id');
                deleteNote(Number(noteId));
            });
        });
    }

    function updateNoteContent(id, content) {
        notes = notes.map(note => note.id === id ? { ...note, content } : note);
        localStorage.setItem('notes', JSON.stringify(notes));
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
        }
    }

    function clearAllNotes() {
        if (notes.length > 0) {
            if (confirm('Are you sure you want to delete all notes?')) {
                notes = [];
                localStorage.removeItem('notes');
                renderNotes();
            }
        }
    }

    function toggleSidebar(){
        document.getElementById("sidebar").classList.toggle('active');
    }

    renderNotes();
    setTimeout(simulateHeaderClick, 100);
});