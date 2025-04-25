import {useEffect, useState } from "react";
import "./slider.css";
import TagElement from "./Tag/tag_element";

function Tag_Slider({signal, tagfunc, setisSliderVisible, isVisible, initialTags}) {
  const [tags, setTags] = useState(initialTags || []);

  const addTag = () => {
    const newTag = {
        id: Date.now(),
    };
    setTags((prevTags) => [...prevTags, newTag]);
};

  useEffect(()=>{
    console.log(tags)
    localStorage.setItem("TagComponents", JSON.stringify(tags))
  },[signal])


  useEffect(() => {
    setTags(JSON.parse(localStorage.getItem("TagComponents")))
    if (initialTags) {
      setTags(initialTags);
    }
  }, [initialTags]);

  const onDelete = (id) => {
    console.log(id)
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div id="tag_slider" className={isVisible ? "active" : ""}>
      <button id="toggle_button" onClick={() => setisSliderVisible(false)}>
        <p>»</p>
      </button>
      <div id="tcontent">
          <div id="tag_table">
            {tags.map((tag) => (
              <TagElement 
              signal={signal}
              id = {tag.id} 
              tagfunc={tagfunc} 
              key={tag.id} 
              initialId={tag.TagName}
              initialValue={tag.value}
              onDelete={() => onDelete(tag.id)} 
              />
            ))}
          </div>
          <button onClick={addTag}>Add Tag</button>
      </div>
    </div>
  );
}

export default Tag_Slider;