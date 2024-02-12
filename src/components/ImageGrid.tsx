import image1 from "../assets/images/dash_1.jpg";
import image2 from "../assets/images/dash_2.jpg";
import image3 from "../assets/images/dash_3.jpg";
import image4 from "../assets/images/dash_4.jpg";
import image5 from "../assets/images/dash_5.jpg";

const ImageGrid = () => {
  return (
    <div className="flex gap-6">
      <div className=" w-[450px] h-[450px]">
        <img src={image1} className="w-full h-full object-cover" alt="" />
      </div>
      <div className=" w-[450px] h-[450px] grid grid-cols-2 gap-6">
        <div className="">
          <img src={image2} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="">
          <img src={image3} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="">
          <img src={image4} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="">
          <img src={image5} className="w-full h-full object-cover" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
