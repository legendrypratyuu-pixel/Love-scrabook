import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [theme, setTheme] = useState('romantic');
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editingTimelineId, setEditingTimelineId] = useState(null);

  useEffect(() => {
    try {
      setNotes(JSON.parse(localStorage.getItem("notes") || "[]"));
      setPhotos(JSON.parse(localStorage.getItem("photos") || "[]"));
      setTimeline(JSON.parse(localStorage.getItem("timeline") || "[]"));
      setTheme(localStorage.getItem("theme") || "romantic");
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("photos", JSON.stringify(photos));
    localStorage.setItem("timeline", JSON.stringify(timeline));
    localStorage.setItem("theme", theme);
  }, [notes, photos, timeline, theme]);

  const deleteItem = (setter, id) => setter(prev => prev.filter(item => item.id !== id));
  const toggleHeartAnimation = () => setIsMessageVisible(prev => !prev);
  const exportData = () => {
    const data = { notes, photos, timeline, theme };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "love-scrapbook.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.notes) setNotes(data.notes);
        if (data.photos) setPhotos(data.photos);
        if (data.timeline) setTimeline(data.timeline);
        if (data.theme) setTheme(data.theme);
      } catch (e) { console.error(e); }
    };
    reader.readAsText(file);
  };

  const addNote = (event) => {
    event.preventDefault();
    const text = event.target.note.value.trim();
    if (!text) return;
    setNotes(prev => [{ id: Date.now(), text }, ...prev]);
    event.target.note.value = '';
  };

  const addPhoto = (files, caption = "No caption") => {
    [...files].forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [{ id: Date.now(), src: e.target.result, caption }, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addTimeline = (event) => {
    event.preventDefault();
    const date = event.target.date.value;
    const title = event.target.title.value.trim();
    const desc = event.target.desc.value || "No description";
    if (!date || !title) return;
    setTimeline(prev => [{ id: Date.now(), date, title, desc }, ...prev]);
    event.target.date.value = '';
    event.target.title.value = '';
    event.target.desc.value = '';
  };

  const saveNote = (id, newText) => { setNotes(prev => prev.map(n => n.id === id ? { ...n, text: newText } : n)); setEditingNoteId(null); };
  const savePhotoCaption = (id, newCaption) => { setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: newCaption } : p)); setEditingPhotoId(null); };
  const saveTimeline = (id, newTitle, newDesc) => { setTimeline(prev => prev.map(t => t.id === id ? { ...t, title: newTitle, desc: newDesc } : t)); setEditingTimelineId(null); };

  const themes = { romantic: 'bg-gradient-to-br from-[#ffdde1] to-[#ee9ca7] text-gray-800', light: 'bg-gray-50 text-gray-800', dark: 'bg-gray-900 text-gray-200' };
  const sectionThemes = { romantic: 'bg-white bg-opacity-80 text-gray-800', light: 'bg-white text-gray-800', dark: 'bg-gray-800 text-gray-200' };
  const cardThemes = { romantic: 'bg-white text-gray-800', light: 'bg-white text-gray-800', dark: 'bg-gray-700 text-gray-200' };
  const headerThemes = { romantic: 'bg-white bg-opacity-80 text-[#e91e63]', light: 'bg-white text-gray-800', dark: 'bg-gray-800 text-[#ff79c6]' };
  const buttonThemes = { romantic: 'bg-[#e91e63] hover:bg-[#d81b60] text-white', light: 'bg-blue-500 hover:bg-blue-600 text-white', dark: 'bg-[#ff79c6] hover:bg-[#d81b60] text-white' };

  const ScrapbookSection = ({ children, title }) => (
    <section className={`max-w-4xl mx-auto my-8 p-6 rounded-2xl shadow-xl transition-colors duration-400 ${sectionThemes[theme]}`}>
      <h2 className={`text-3xl font-bold mb-4 ${headerThemes[theme]}`}>{title}</h2>
      {children}
    </section>
  );

  return (
    <div className={`min-h-screen font-sans ${themes[theme]} transition-colors duration-400`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 p-4 text-center backdrop-blur-sm ${headerThemes[theme]}`}>
        <h1 className="text-4xl font-bold mb-2" contentEditable="true">💖 Our Love Scrapbook 💖</h1>
        <label className="text-sm font-medium">Theme:
          <select className={`ml-2 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600 focus:ring-purple-500' : 'bg-white text-gray-800 border-gray-300 focus:ring-pink-500'}`} value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="romantic">Romantic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </header>

      {/* Heart */}
      <ScrapbookSection title="Click My Heart!">
        <div className="flex flex-col items-center">
          <motion.button whileTap={{ scale: 0.9 }} animate={isMessageVisible ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.5 }} className="text-8xl p-4 transition-transform duration-200 focus:outline-none" onClick={toggleHeartAnimation}>❤️</motion.button>
          <AnimatePresence>
            {isMessageVisible && (<motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }} className={`mt-4 p-6 rounded-2xl shadow-lg text-center ${sectionThemes[theme]}`}><p className="text-2xl font-semibold text-pink-600">I love you! You make my heart flutter every day. ❤️</p></motion.div>)}
          </AnimatePresence>
        </div>
      </ScrapbookSection>

      {/* Notes with Drag & Drop */}
      <ScrapbookSection title="💌 Love Notes">
        <form onSubmit={addNote} className="flex gap-2 mb-4 flex-wrap">
          <input name="note" type="text" placeholder="Write a note..." className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-200"/>
          <button type="submit" className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${buttonThemes[theme]}`}>Add</button>
        </form>
        <Reorder.Group axis="y" values={notes} onReorder={setNotes} className="flex flex-col-reverse gap-3">
          {notes.map(note => (
            <Reorder.Item key={note.id} value={note} className={`p-4 rounded-xl shadow-md flex items-center justify-between cursor-grab ${cardThemes[theme]}`}>
              {editingNoteId === note.id ? <input className="flex-grow p-2 border rounded" defaultValue={note.text} onBlur={e => saveNote(note.id,e.target.value)} autoFocus /> : <p onClick={() => setEditingNoteId(note.id)} className="flex-grow cursor-pointer">{note.text}</p>}
              <button onClick={() => deleteItem(setNotes,note.id)} className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${buttonThemes[theme]}`}>Delete</button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </ScrapbookSection>

      {/* Photos with Drag & Drop */}
      <ScrapbookSection title="📸 Memories Gallery">
        <div className="flex flex-col items-center p-4 mb-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-pink-50 transition" onDrop={e => { e.preventDefault(); addPhoto(e.dataTransfer.files); }} onDragOver={e => e.preventDefault()}>
          <p>Drag & Drop Images Here</p>
          <input type="file" accept="image/*" multiple onChange={e => addPhoto(e.target.files)} className="mt-2"/>
        </div>
        <Reorder.Group axis="y" values={photos} onReorder={setPhotos} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <Reorder.Item key={photo.id} value={photo} className={`p-4 rounded-xl shadow-md cursor-grab ${cardThemes[theme]}`}>
              <img src={photo.src} alt={photo.caption} className="w-full h-48 object-cover rounded-lg mb-2"/>
              {editingPhotoId === photo.id ? <input defaultValue={photo.caption} onBlur={e => savePhotoCaption(photo.id,e.target.value)} autoFocus className="w-full border p-1 rounded"/> : <p onClick={() => setEditingPhotoId(photo.id)} className="text-center italic cursor-pointer">{photo.caption}</p>}
              <button onClick={() => deleteItem(setPhotos,photo.id)} className={`mt-2 w-full px-3 py-1 rounded-full text-xs font-bold ${buttonThemes[theme]}`}>Delete</button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </ScrapbookSection>

      {/* Timeline with Drag & Drop */}
      <ScrapbookSection title="⏳ Our Journey">
        <form onSubmit={addTimeline} className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
          <input name="date" type="date" className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-200"/>
          <input name="title" placeholder="Title" className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-200"/>
          <input name="desc" placeholder="Description" className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors duration-200"/>
          <button type="submit" className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${buttonThemes[theme]}`}>Add</button>
        </form>
        <Reorder.Group axis="y" values={timeline} onReorder={setTimeline} className="flex flex-col-reverse gap-3">
          {timeline.map(item => (
            <Reorder.Item key={item.id} value={item} className={`p-4 rounded-xl shadow-md cursor-grab ${cardThemes[theme]}`}>
              <h3 className="font-bold text-lg mb-1">{item.date}</h3>
              {editingTimelineId === item.id ? <div><input defaultValue={item.title} onBlur={e => saveTimeline(item.id,e.target.value,item.desc)} autoFocus className="w-full border p-1 rounded mb-1"/><input defaultValue={item.desc} onBlur={e => saveTimeline(item.id,item.title,e.target.value)} className="w-full border p-1 rounded"/></div> : <div onClick={() => setEditingTimelineId(item.id)} className="cursor-pointer"><p className="font-semibold">{item.title}</p><p>{item.desc}</p></div>}
              <button onClick={() => deleteItem(setTimeline,item.id)} className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${buttonThemes[theme]}`}>Delete</button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </ScrapbookSection>

      {/* Footer */}
      <footer className={`text-center p-6 ${themes[theme]} bg-opacity-80`}>
        <p className="mb-4">Made with 💖 | Everything saves automatically</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={exportData} className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${buttonThemes[theme]}`}>📤 Export</button>
          <label className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${buttonThemes[theme]}`}>
            <input type="file" accept="application/json" onChange={importData} className="hidden" />📥 Import
          </label>
          <button onClick={() => window.print()} className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${buttonThemes[theme]}`}>🖨️ Print</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
