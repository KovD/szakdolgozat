import { useState } from "react";
import "./slider.css";
import TagElement from "./Tag/tag_element";

function Tag_Slider({ setisSliderVisible, isVisible }) {
  const [tags, setTags] = useState([]);

  const addTag = () => {
    setTags([...tags, { id: Date.now() }]);
  };

  const onDelete = (id) => {
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
            <TagElement key={tag.id} onDelete={() => onDelete(tag.id)} />
          ))}
        </div>
        <button onClick={addTag}>Afd</button>
      </div>
    </div>
  );
}

export default Tag_Slider;
