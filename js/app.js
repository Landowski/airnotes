document.addEventListener('DOMContentLoaded', (event) => {
    loadDarkMode();
    const notesList = document.getElementById('notesList');
    const nothingHere = document.getElementById('nothingHere');
    const createNoteBtn = document.getElementById('createNoteBtn');
    const sidebarBtn = document.getElementById('sidebarBtn');
    const clearAllNotesBtn = document.getElementById('clearAllNotesBtn');
    const closeSidebar = document.getElementById('close');
    const container = document.getElementById('container');
    const sidebar = document.getElementById('sidebar');
    const help = document.getElementById('help');
    const overlay = document.getElementById('overlay');
    const okPopup = document.getElementById('okPopup');
    const darkModeToggle = document.getElementById('darkMode');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let offsetX, offsetY;

    function loadDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        const elementsToToggle = document.querySelectorAll('body, #sidebar, #clearAllNotesBtn, #nothingHere, .buttons, #createNoteBtn, #sidebarBtn, #help, #darkMode, .icon-tabler-trash, .icon-tabler-map-pin');
        elementsToToggle.forEach(element => {
            if (isDarkMode) {
                element.classList.add('dark');
                element.classList.remove('light');
            } else {
                element.classList.add('light');
                element.classList.remove('dark');
            }
        });
    }

    createNoteBtn.addEventListener('click', createNote);
    sidebarBtn.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    clearAllNotesBtn.addEventListener('click', clearAllNotes);

    help.addEventListener('click', popup);
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            popup();
        }
    });
    okPopup.addEventListener('click', function(event) {
        event.stopPropagation();
        popup();
    });

    function toggleDarkMode() {
        const elementsToToggle = document.querySelectorAll('body, #sidebar, .note, #clearAllNotesBtn, #nothingHere, .buttons, #createNoteBtn, #sidebarBtn, #help, #darkMode, .icon-tabler-trash, .icon-tabler-map-pin');
        const isDarkMode = document.body.classList.contains('dark');
        
        elementsToToggle.forEach(element => {
            element.classList.toggle('light');
            element.classList.toggle('dark');
        });
        
        localStorage.setItem('darkMode', !isDarkMode);
    }
      
    darkModeToggle.addEventListener('click', () => {
        toggleDarkMode();
        renderNotes();
    });

    function createNote() {
        const noteWidth = 264;
        const noteHeight = 110;
        const left = (window.innerWidth - noteWidth) / 2 + window.scrollX;
        const top = (window.innerHeight - noteHeight) / 2 + window.scrollY;
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const note = {
            id: Date.now(),
            content: '',
            position: { left: `${left}px`, top: `${top}px` },
            createdAt: formattedDate,
            rotation: 0,
            color: 'default'
        };
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        renderSidebar();
    }

    function formatDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = String(hours).padStart(2, '0');
        return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
    }
    
    function renderNotes() {
        container.innerHTML = '';
        const isDarkMode = document.body.classList.contains('dark');
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.classList.add(isDarkMode ? 'dark' : 'light');
            noteElement.style.left = note.position.left;
            noteElement.style.top = note.position.top;
            noteElement.dataset.id = note.id;
            noteElement.style.transform = `rotate(${note.rotation || 0}deg)`;
            noteElement.style.zIndex = note.zIndex || 1;
            
            noteElement.innerHTML = `
                <div class="header">
                    <div class="date-hour">${note.createdAt}</div>
                    <div class="note-icons">
                        <i class="las la-angle-double-up bring-front"></i>
                        <i class="las la-angle-double-down send-back"></i>
                        <i class="las la-palette color-picker"></i>
                        <i class="las la-sync rotate-note"></i>
                        <i class="las la-times delete-note"></i>
                    </div>
                </div>
                <div class="menu">
                <i class="fa-solid fa-bold bold-button"></i>
                <i class="fa-solid fa-italic italic-button"></i>
                <i class="fa-solid fa-underline underline-button"></i>
                <i class="fa-solid fa-align-left align-left-button"></i>
                <i class="fa-solid fa-align-center align-center-button"></i>
                <i class="fa-solid fa-align-right align-right-button"></i>
                <i class="fa-solid fa-list list-button"></i>
                <i class="fa-solid fa-link link-button"></i>
                <i class="fa-solid fa-image image-button"></i>
                <i class="fa-solid fa-text-slash clear-format-button"></i>
                <select class="font-size">
                    <option value="11px">11</option>
                    <option value="12px">12</option>
                    <option value="13px" selected>13</option>
                    <option value="14px">14</option>
                    <option value="15px">15</option>
                    <option value="16px">16</option>
                    <option value="17px">17</option>
                    <option value="18px">18</option>
                    <option value="19px">19</option>
                    <option value="20px">20</option>
                    </select>
                </div>
                <div contenteditable="true" class="editor">${note.content || ''}</div>
                <div class="color-options" style="display: none;">
                    <div class="color-option" data-color="default"></div>
                    <div class="color-option" data-color="red"></div>
                    <div class="color-option" data-color="pink"></div>
                    <div class="color-option" data-color="purple"></div>
                    <div class="color-option" data-color="deep-purple"></div>
                    <div class="color-option" data-color="indigo"></div>
                    <div class="color-option" data-color="blue"></div>
                    <div class="color-option" data-color="light-blue"></div>
                    <div class="color-option" data-color="cyan"></div>
                    <div class="color-option" data-color="teal"></div>
                    <div class="color-option" data-color="green"></div>
                    <div class="color-option" data-color="light-green"></div>
                    <div class="color-option" data-color="lime"></div>
                    <div class="color-option" data-color="yellow"></div>
                    <div class="color-option" data-color="amber"></div>
                    <div class="color-option" data-color="orange"></div>
                    <div class="color-option" data-color="deep-orange"></div>
                    <div class="color-option" data-color="brown"></div>
                    <div class="color-option" data-color="grey"></div>
                    <div class="color-option" data-color="blue-grey"></div>
                </div>
            `;
            container.appendChild(noteElement);
            
            applyNoteColor(noteElement, note.color || 'default');

            const editor = noteElement.querySelector('.editor');
            editor.addEventListener('blur', () => updateNoteContent(note.id, editor.innerHTML));

            editor.addEventListener('mouseup', (event) => {
                const currentWidth = editor.clientWidth;
                updateNoteWidth(note.id, currentWidth);
            });
            
            editor.style.width = note.width || '264px';

            const header = noteElement.querySelector('.header');
            const rotateIcon = noteElement.querySelector('.rotate-note');
            const deleteIcon = noteElement.querySelector('.delete-note');
            const colorPicker = noteElement.querySelector('.color-picker');
            const colorOptions = noteElement.querySelector('.color-options');

            const boldButton = noteElement.querySelector('.bold-button');
            const italicButton = noteElement.querySelector('.italic-button');
            const underlineButton = noteElement.querySelector('.underline-button');
            const alignLeftButton = noteElement.querySelector('.align-left-button');
            const alignCenterButton = noteElement.querySelector('.align-center-button');
            const alignRightButton = noteElement.querySelector('.align-right-button');
            const listButton = noteElement.querySelector('.list-button');
            const linkButton = noteElement.querySelector('.link-button');
            const imageButton = noteElement.querySelector('.image-button');
            const fontSizeSelect = noteElement.querySelector('.font-size');
            const clearFormatButton = noteElement.querySelector('.clear-format-button');

            colorPicker.addEventListener('click', (e) => {
                e.stopPropagation();
                colorOptions.style.display = colorOptions.style.display === 'none' ? 'flex' : 'none';
            });

            colorOptions.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    updateNoteColor(note.id, color);
                    applyNoteColor(noteElement, color);
                    colorOptions.style.display = 'none';
                });
            });

            const bringFrontIcon = noteElement.querySelector('.bring-front');
            const sendBackIcon = noteElement.querySelector('.send-back');

            bringFrontIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                bringNoteToFront(note.id);
            });

            sendBackIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                sendNoteToBack(note.id);
            });

            let isDragging = false;
            let isRotating = false;
            let startAngle = 0;
            let currentRotation = note.rotation || 0;

            header.addEventListener('mousedown', (e) => {
                if (e.target === header || e.target.classList.contains('date-hour')) {
                    const currentWidth = editor.clientWidth;
                    updateNoteWidth(note.id, currentWidth);
                    startDragging(e);
                }
            });

            rotateIcon.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startRotating(e);
            });

            deleteIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNote(note.id);
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    drag(e, noteElement);
                } else if (isRotating) {
                    rotate(e);
                }
            });

            document.addEventListener('mouseup', () => {
                stopDragging();
                stopRotating();
            });

            boldButton.addEventListener('click', () => applyFormat('bold', editor));
            italicButton.addEventListener('click', () => applyFormat('italic', editor));
            underlineButton.addEventListener('click', () => applyFormat('underline', editor));
            alignLeftButton.addEventListener('click', () => applyFormat('justifyLeft', editor));
            alignCenterButton.addEventListener('click', () => applyFormat('justifyCenter', editor));
            alignRightButton.addEventListener('click', () => applyFormat('justifyRight', editor));
            listButton.addEventListener('click', () => applyFormat('insertUnorderedList', editor));
            clearFormatButton.addEventListener('click', () => applyFormat('removeFormat', editor));

            function getSelection() {
                return window.getSelection();
            }
        
            function saveSelection() {
                const selection = getSelection();
                if (selection.rangeCount > 0) {
                    return selection.getRangeAt(0);
                }
                return null;
            }
        
            function restoreSelection(range) {
                if (range) {
                    const selection = getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        
            function applyFormat(command, value = null) {
                const range = saveSelection();
                editor.focus();
                restoreSelection(range);
                document.execCommand(command, false, value);
            }
            
            linkButton.addEventListener('click', () => {
                const range = saveSelection();
                const url = prompt('Insert link', 'https://');
                if (url) {
                    editor.focus();
                    restoreSelection(range);
                    
                    // Executa o comando para criar o link
                    document.execCommand('createLink', false, url);
                    
                    // Encontra o link recém-criado e define 'contenteditable' como 'false'
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const linkElement = selection.anchorNode.parentElement;
                        if (linkElement.tagName === 'A') {
                            linkElement.setAttribute('contenteditable', 'false');
                            linkElement.setAttribute('target', '_blank'); // Abre o link em uma nova aba
                        }
                    }
                }
            });
            

            imageButton.addEventListener('click', () => {
                const range = saveSelection();
                const url = prompt('Insert image link');
                if (url) {
                    editor.focus();
                    restoreSelection(range);
                    document.execCommand('insertImage', false, url);
                }
            });

            fontSizeSelect.addEventListener('change', () => {
                const range = saveSelection();
                editor.focus();
                restoreSelection(range);
                document.execCommand('fontSize', false, '7');
                const selection = getSelection();
                if (selection.rangeCount > 0) {
                    const span = selection.getRangeAt(0).commonAncestorContainer.parentElement;
                    if (span.tagName === 'FONT') {
                        span.style.fontSize = fontSizeSelect.value;
                    }
                }
            });

            function startDragging(e) {
                isDragging = true;
                offsetX = e.clientX - noteElement.getBoundingClientRect().left;
                offsetY = e.clientY - noteElement.getBoundingClientRect().top;
                noteElement.style.zIndex = getHighestZIndex() + 1;
            }

            function drag(e) {
                const left = e.pageX - offsetX;
                const top = e.pageY - offsetY;
                updateNotePosition(note.id, left, top);
            }

            function stopDragging() {
                isDragging = false;
            }

            function startRotating(e) {
                isRotating = true;
                const rect = noteElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            }

            function rotate(e) {
                const rect = noteElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const rotation = angle - startAngle;
                currentRotation += rotation * (180 / Math.PI);
                noteElement.style.transform = `rotate(${currentRotation}deg)`;
                startAngle = angle;
            }

            function stopRotating() {
                if (isRotating) {
                    isRotating = false;
                    updateNoteRotation(note.id, currentRotation);
                }
            }

            function bringNoteToFront(id) {
                const highestZIndex = Math.max(...notes.map(note => note.zIndex || 0), 0);
                notes = notes.map(note => 
                    note.id === id ? { ...note, zIndex: highestZIndex + 1 } : note
                );
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            }
        
            function sendNoteToBack(id) {
                const lowestZIndex = Math.min(...notes.map(note => note.zIndex || 0), 0);
                notes = notes.map(note => 
                    note.id === id ? { ...note, zIndex: lowestZIndex - 1 } : note
                );
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            }

            function updateNoteWidth(id, width) {
                notes = notes.map(note =>
                    note.id === id ? { ...note, width: `${width}px` } : note
                );
                localStorage.setItem('notes', JSON.stringify(notes));
            }

        });

    }

    function applyNoteColor(noteElement, color) {
        const header = noteElement.querySelector('.header');
        const menu = noteElement.querySelector('.menu');
        const editor = noteElement.querySelector('.editor');

        switch (color) {
            case 'red':
                header.style.backgroundColor = '#FFCDD2';
                menu.style.backgroundColor = '#FFEBEE';
                editor.style.backgroundColor = '#FFEBEE';
                break;
            case 'pink':
                header.style.backgroundColor = '#F8BBD0';
                menu.style.backgroundColor = '#FCE4EC';
                editor.style.backgroundColor = '#FCE4EC';
                break;
            case 'purple':
                header.style.backgroundColor = '#E1BEE7';
                menu.style.backgroundColor = '#F3E5F5';
                editor.style.backgroundColor = '#F3E5F5';
                break;
            case 'deep-purple':
                header.style.backgroundColor = '#D1C4E9';
                menu.style.backgroundColor = '#EDE7F6';
                editor.style.backgroundColor = '#EDE7F6';
                break;
            case 'indigo':
                header.style.backgroundColor = '#C5CAE9';
                menu.style.backgroundColor = '#E8EAF6';
                editor.style.backgroundColor = '#E8EAF6';
                    break;
            case 'blue':
                header.style.backgroundColor = '#BBDEFB';
                menu.style.backgroundColor = '#E3F2FD';
                editor.style.backgroundColor = '#E3F2FD';
                break;
            case 'light-blue':
                header.style.backgroundColor = '#B3E5FC';
                menu.style.backgroundColor = '#E1F5FE';
                editor.style.backgroundColor = '#E1F5FE';
                break;
            case 'cyan':
                header.style.backgroundColor = '#B2EBF2';
                menu.style.backgroundColor = '#E0F7FA';
                editor.style.backgroundColor = '#E0F7FA';
                break;
            case 'teal':
                header.style.backgroundColor = '#B2DFDB';
                menu.style.backgroundColor = '#E0F2F1';
                editor.style.backgroundColor = '#E0F2F1';
                break;
            case 'green':
                header.style.backgroundColor = '#C8E6C9';
                menu.style.backgroundColor = '#E8F5E9';
                editor.style.backgroundColor = '#E8F5E9';
                break;
            case 'light-green':
                header.style.backgroundColor = '#DCEDC8';
                menu.style.backgroundColor = '#F1F8E9';
                editor.style.backgroundColor = '#F1F8E9';
                break;
            case 'lime':
                header.style.backgroundColor = '#F0F4C3';
                menu.style.backgroundColor = '#F9FBE7';
                editor.style.backgroundColor = '#F9FBE7';
                break;
            case 'yellow':
                header.style.backgroundColor = '#FFF9C4';
                menu.style.backgroundColor = '#FFFDE7';
                editor.style.backgroundColor = '#FFFDE7';
                break;
            case 'amber':
                header.style.backgroundColor = '#FFECB3';
                menu.style.backgroundColor = '#FFF8E1';
                editor.style.backgroundColor = '#FFF8E1';
                break;
            case 'orange':
                header.style.backgroundColor = '#FFE0B2';
                menu.style.backgroundColor = '#FFF3E0';
                editor.style.backgroundColor = '#FFF3E0';
                break;
            case 'deep-orange':
                header.style.backgroundColor = '#FFCCBC';
                menu.style.backgroundColor = '#FBE9E7';
                editor.style.backgroundColor = '#FBE9E7';
                break;
            case 'brown':
                header.style.backgroundColor = '#D7CCC8';
                menu.style.backgroundColor = '#EFEBE9';
                editor.style.backgroundColor = '#EFEBE9';
                break;
            case 'grey':
                header.style.backgroundColor = '#F5F5F5';
                menu.style.backgroundColor = '#FAFAFA';
                editor.style.backgroundColor = '#FAFAFA';
                break;
            case 'blue-grey':
                header.style.backgroundColor = '#CFD8DC';
                menu.style.backgroundColor = '#ECEFF1';
                editor.style.backgroundColor = '#ECEFF1';
                break;
            default:
                header.style.backgroundColor = '#f9f9f9';
                menu.style.backgroundColor = '#ffffff';
                editor.style.backgroundColor = '#ffffff';
                noteElement.style.boxShadow = '0px 0px 4px 0px rgba(60, 72, 88, 0.2)';
                break;
        }
    }

    function getHighestZIndex() {
        return Math.max(
            ...Array.from(document.querySelectorAll('.note'))
                .map(el => parseInt(getComputedStyle(el).zIndex) || 0)
        );
    }

    function renderSidebar() {
        if (notes.length > 0) {
            notesList.innerHTML = '';
            nothingHere.style.display = 'none';
            notesList.style.display = 'block';
            notes.forEach(note => {
                const listItem = document.createElement('li');
                const borderColor = getNoteColor(note.color);
                listItem.style.borderLeft = `10px solid ${borderColor}`;
                listItem.style.paddingLeft = '10px';
                listItem.innerHTML = `
                    <span style="width: 80%;">${note.content ? (note.content.trim() === '' ? 'Empty' : note.content) : 'Empty'}</span>
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash trash light" data-id="${note.id}"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin locate light" data-id="${note.id}"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>
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

    function getNoteColor(color) {
        switch (color) {
            case 'red':
                return '#FFCDD2';
            case 'pink':
                return '#F8BBD0';
            case 'purple':
                return '#E1BEE7';
            case 'deep-purple':
                return '#D1C4E9';
            case 'indigo':
                return '#C5CAE9';
            case 'blue':
                return '#BBDEFB';
            case 'light-blue':
                return '#B3E5FC';
            case 'cyan':
                return '#B2EBF2';
            case 'teal':
                return '#B2DFDB';
            case 'green':
                return '#C8E6C9';
            case 'light-green':
                return '#DCEDC8';
            case 'lime':
                return '#F0F4C3';
            case 'yellow':
                return '#FFF9C4';
            case 'amber':
                return '#FFECB3';
            case 'orange':
                return '#FFE0B2';
            case 'deep-orange':
                return '#FFCCBC';
            case 'brown':
                return '#D7CCC8';
            case 'grey':
                return '#F5F5F5';
            case 'blue-grey':
                return '#CFD8DC';
            default:
                return '#f9f9f9';
        }
    }

    function locateNote(id) {
        const noteElement = document.querySelector(`.note[data-id="${id}"]`);
        if (noteElement) {
            const rect = noteElement.getBoundingClientRect();
            const isVisible = (rect.top >= 0 && rect.bottom <= window.innerHeight) && 
                              (rect.left >= 0 && rect.right <= window.innerWidth);

            if (!isVisible) {
                noteElement.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
            }

            if (noteElement.classList.contains('light')) {
                noteElement.style.transition = 'box-shadow 0.3s ease-in-out';
                noteElement.style.boxShadow = '0px 0px 25px 0px rgba(0,0,0,0.5)';
                setTimeout(() => {
                    noteElement.style.boxShadow = '';
                }, 1500);
            } else {
                noteElement.style.transition = 'box-shadow 0.3s ease-in-out';
                noteElement.style.boxShadow = '0px 0px 25px 0px rgba(255,255,255,0.7)';
                setTimeout(() => {
                    noteElement.style.boxShadow = '';
                }, 1500);
            }
        }
    }

    function updateNoteColor(id, color) {
        notes = notes.map(note => 
            note.id === id ? { ...note, color } : note
        );
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function updateNoteContent(id, content) {
        notes = notes.map(note => {
            if (note.id === id) {
                return { ...note, content: content || '' };
            }
            return note;
        });
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

    function updateNoteRotation(id, rotation) {
        notes = notes.map(note => 
            note.id === id ? { ...note, rotation } : note
        );
        localStorage.setItem('notes', JSON.stringify(notes));
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
                renderNotes();
                renderSidebar();
            }
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        renderSidebar();
    }

    function popup() {
        overlay.classList.toggle('active');
    }

    renderNotes();
    renderSidebar();
});