"use client";
import React, { useState } from "react";


function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.log(err);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.log(err);
    }
  };
  return [storedValue, setValue];
}


export default function ShoppingList() {
  
  const [items, setItems] = useLocalStorage("shopping-items", []);
  const [productTitle, setProductTitle] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10) 
  );
  const [imageUrl, setImageUrl] = useState("");

  function addItem(e) {
    e.preventDefault();
    const title = productTitle.trim();
    if (!title) return;
    const newItem = {
      id: Date.now(),
      productTitle: title,
      status: false,
      date: date || new Date().toISOString().slice(0, 10),
      imageUrl: imageUrl.trim() || undefined,
    };
    setItems([newItem, ...items]);
    setProductTitle("");
    setImageUrl("");
  }

  function toggleStatus(id) {
    setItems(items.map(it => it.id === id ? { ...it, status: !it.status } : it));
  }

  function removeItem(id) {
    setItems(items.filter(it => it.id !== id));
  }
  function ListElement({ item }) {
    return (
      <li style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
        <input
          type="checkbox"
          checked={item.status}
          onChange={() => toggleStatus(item.id)}
          title="gekauft?"
        />
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            width={36}
            height={36}
            style={{objectFit:"cover",borderRadius:6}}
            onError={(e)=> (e.currentTarget.style.display="none")}
          />
        ) : (
          <div style={{width:36,height:36,background:"#eee",borderRadius:6,display:"grid",placeItems:"center",fontSize:12}}>IMG</div>
        )}
        <div style={{flex:1}}>
          <div style={{textDecoration: item.status ? "line-through" : "none"}}>
            {item.productTitle}
          </div>
          <div style={{fontSize:12,color:"#666"}}>{item.date}</div>
        </div>
        <button onClick={() => removeItem(item.id)}>Löschen</button>
      </li>
    );
  }

  
  return (
    <main style={{maxWidth:520,margin:"24px auto",padding:"0 16px",fontFamily:"system-ui, Arial"}}>
      <h1>🛒 Einkaufsliste</h1>

      {}
      <form onSubmit={addItem} style={{display:"grid",gap:8,margin:"12px 0 16px"}}>
        <input
          placeholder="Produkt (z.B. Milch)"
          value={productTitle}
          onChange={(e)=>setProductTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />
        <input
          placeholder="Bild-URL (optional)"
          value={imageUrl}
          onChange={(e)=>setImageUrl(e.target.value)}
        />
        <button>Hinzufügen</button>
      </form>
    
      {}
      {items.length === 0 ? (
        <p>Noch keine Produkte.</p>
      ) : (
        <ul style={{listStyle:"none",padding:0,margin:0}}>
          {items.map(item => (
            <ListElement key={item.id} item={item} />
          ))}
        </ul>
      )}

      <p style={{marginTop:12,fontSize:12,color:"#666"}}>
        Speichert unter <code>localStorage["shopping-items"]</code>.
      </p>
    </main>
  );
}



