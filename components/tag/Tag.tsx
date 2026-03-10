/* components/tag/Tag.tsx */

import { MdOutlinePublic } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { EventTag } from "@/types/event";
import { EventTagLabel } from "@/utils/eventLabel";
import "./Tag.css";

type TagProps = {
  tag: EventTag;
};

export default function Tag({ tag }: TagProps ) {
  
  const icons = {
    [EventTag.PUBLIC]: <MdOutlinePublic className="tag-icon"/>,
    [EventTag.PRIVATE]: <FaLock className="tag-icon"/>,
  };

  return (
    <div className="tag-styles">
      {icons[tag]}
      
      <span className="tag-text">
        {EventTagLabel[tag]}
      </span>
    </div>
  );
};