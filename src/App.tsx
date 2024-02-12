import searchIcon from "./assets/search_icon.svg";
import micIcon from "./assets/mic_icon.svg";
import cameraIcon from "./assets/camera_icon.svg";
import nagarroLogo from "./assets/Nagarro_Logo.svg";
import languageIcon from "./assets/language.svg";
import chatIcon from "./assets/chat.svg";
import cartIcon from "./assets/cart.svg";
import micImage from "./assets/images/microphone.png";
import ImageGrid from "./components/ImageGrid";
import Siriwave from "react-siriwave";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { addToMessages, fetchMessage } from "./store/slice/messageSlice";
import tickImage from "./assets/images/tick.png";
import Speech from "./components/speech";
import annyang from "annyang";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showVoice, setShowVoice] = useState(false);
  const dispatch = useAppDispatch();
  const responseData = useAppSelector((state) => state.message.responseData);
  const [speechText, setSpeechText] = useState("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [showToast, setShowToast] = useState("");

  const playAfterChange = () => {};

  useEffect(() => {
    if (responseData) {
      setSpeechText(responseData?.responce_data);
      playAfterChange();
    }
  }, [responseData]);

  useEffect(() => {
    if (annyang) {
      annyang.addCallback("result", (phrases: string[]) => {
        const firstPhrase = phrases[0];
        if (!isListening && showVoice === false) {
          if (
            firstPhrase.toLowerCase().includes("hello vk") ||
            firstPhrase.toLowerCase().includes("hello weeke") ||
            firstPhrase.toLowerCase().includes("hello pk") ||
            firstPhrase.toLowerCase().includes("hello vijay") ||
            firstPhrase.toLowerCase().includes("hello vicki.")
          ) {
            setShowVoice(() => {
              startListening();
              return true;
            });
          } else {
            console.log(firstPhrase);
            toast("Say 'Hello VK' to begin!");
          }
        } else {
          console.log(firstPhrase);
          handleWordDetection(firstPhrase);
        }
      });

      annyang.start();

      return () => {
        annyang.abort();
        annyang.removeCallback("result");
      };
    }
  });

  const handleWordDetection = (text: string) => {
    setSearchTerm(() => {
      sendMessage(text);
      return text;
    });
  };

  const startListening = () => {
    setIsListening(true);
    console.log("Started Listening!!!");
  };

  const sendMessage = (text: string) => {
    const query = text;
    setSearchTerm(text);
    const body = {
      user_request: query,
      ask_for: responseData?.ask_for,
      current_intent: responseData?.current_intent,
      cart_id: responseData?.cart_id,
      address_id: responseData?.address_id,
      order_id: responseData?.order_id,
      prv_response: responseData?.prv_response,
      products: responseData?.products?.map((p) => {
        const price = p.price.toString();
        return { ...p, price };
      }),
      selectedProduct: responseData?.selectedProduct
        ? {
            ...responseData.selectedProduct,
            price: responseData?.selectedProduct?.price.toString(),
          }
        : null,
    };
    dispatch(addToMessages(body));
    dispatch(fetchMessage(body));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(searchTerm);
  };

  return (
    <div className="w-full h-screen bg-primary-background flex flex-col">
      <ToastContainer />
      <div className="w-full h-[12vh] flex justify-between items-center px-10">
        <div className="flex-1">
          <img src={nagarroLogo} height={25} width={25} alt="" />
        </div>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
          className="flex-1 p-2 px-4 rounded-full bg-white flex gap-4"
        >
          <img src={searchIcon} height={15} width={15} alt="" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 focus:outline-none px-1"
          />
          <img
            src={micIcon}
            onClick={() => {
              setShowVoice(!showVoice);
              setIsListening(!isListening);
            }}
            height={12}
            width={12}
            alt=""
            className="cursor-pointer"
          />
          <img src={cameraIcon} height={15} width={15} alt="" />
        </form>
        <div className="flex-1 flex gap-4 justify-end">
          <img src={languageIcon} height={25} width={25} alt="" />
          <img src={chatIcon} height={25} width={25} alt="" />
          <img src={cartIcon} height={25} width={25} alt="" />
        </div>
      </div>
      <div className="w-full h-[88vh] flex flex-col justify-center items-center">
        <div className="w-full h-full flex justify-center items-start gap-6 mt-8">
          {responseData === null && <ImageGrid />}
          {responseData &&
            responseData.cart_id === null &&
            responseData.selectedProduct && (
              <div className="bg-white h-[350px] w-[600px] flex rounded-md justify-center items-start p-2 gap-4">
                <div className="bg-gray-200 w-1/4 h-full rounded-md">Image</div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-bold">
                    {responseData.selectedProduct.product_name}
                  </p>
                  <p className="font-semibold text-sm">
                    {responseData.selectedProduct.summary.length > 300
                      ? responseData.selectedProduct.summary.substring(0, 300) +
                        "..."
                      : responseData.selectedProduct.summary}
                  </p>
                  {responseData.selectedProduct.varient &&
                    responseData.selectedProduct.varient.map((v, _) => (
                      <div key={_} className="flex flex-col">
                        <p className="font-bold">{v.name}</p>
                        <div className="flex gap-4">
                          {v.avilable &&
                            v.avilable.map((a, _) => {
                              if (
                                a.toLowerCase() ===
                                v.selected_varient?.toLowerCase()
                              ) {
                                return (
                                  <div className="bg-[#46d7ac] px-4 py-1 rounded-full">
                                    {a}
                                  </div>
                                );
                              }
                              return (
                                <div className="border-2 px-4 py-1 rounded-full">
                                  {a}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  <div>
                    <p className="font-bold py-1">Quantity</p>
                    <div className="border-2 px-4 py-1 rounded-full">
                      0 Peice
                    </div>
                  </div>
                </div>
              </div>
            )}
          {responseData &&
            responseData.cart_id === null &&
            responseData.selectedProduct === null &&
            responseData.products?.map((p, _) => (
              <div
                key={_}
                className="bg-white h-[300px] w-[200px] p-4 flex flex-col justify-between rounded-md"
              >
                <div className="bg-gray-200 w-full h-40 rounded-md">Image</div>
                <p className="font-bold h-12 flex items-center">
                  {p.product_name}
                </p>
                <p className="text-sm font-semibold ">
                  {p.summary.length > 60
                    ? p.summary.substring(0, 60) + "..."
                    : p.summary}
                </p>
              </div>
            ))}
          {responseData?.order_id && (
            <div className="bg-white w-[50%] h-[300px] flex flex-col justify-around items-center rounded-md p-4">
              <div className="bg-[#46d7ac] rounded-full p-2 h-16 w-16">
                <img src={tickImage} alt="" />
              </div>
              <p className="text-2xl font-bold text-[#46d7ac]">
                Your order has been placed successfully!
              </p>
              <p className="text-center">
                {responseData.responce_data.substring(40)}
              </p>
              <div className="flex flex-col items-center">
                <p className="font-bold">Thank You</p>
                <p>Do you wish to place another order?</p>
              </div>
            </div>
          )}

          {responseData?.cart_id && responseData.address_id === null && (
            <div className="bg-white w-[50%] h-[300px] flex flex-col justify-start items-center rounded-md p-4 gap-2">
              <div className="border border-b-1 border-t-0 border-l-0 border-r-0 w-full pb-2 font-bold">
                Order Details
              </div>
              <p>{responseData.responce_data}</p>
            </div>
          )}

          {responseData?.address_id && (
            <div className="bg-white w-[50%] h-[300px] flex flex-col justify-start items-center rounded-md p-4 gap-2">
              <div className="border border-b-1 border-t-0 border-l-0 border-r-0 w-full pb-2 font-bold">
                Address Details
              </div>
              <label htmlFor="" className="flex gap-2 w-full">
                <input type="radio" checked />
                {responseData.responce_data.length > 24
                  ? responseData.responce_data.substring(24, 70)
                  : responseData.responce_data}
              </label>
            </div>
          )}
        </div>
        {showVoice && (
          <div className="bg-black w-full h-1/5 absolute bottom-0 opacity-80 flex flex-col gap-4 justify-center items-center overflow-hidden">
            <div className="h-[180px] flex items-center justify-center">
              <Siriwave theme="ios9" autostart={true} />
              <div className="absolute m-auto top-5 ">
                <img src={micImage} height={50} width={50} alt="" />
              </div>
              <div className="absolute bottom-2 w-[70%] text-center">
                <div className="text-white flex justify-center gap-10 w-full">
                  {responseData?.responce_data ? (
                    <div className="flex gap-4">
                      {responseData?.responce_data}
                      <Speech text={responseData?.responce_data} />
                    </div>
                  ) : searchTerm.length > 0 ? (
                    searchTerm
                  ) : (
                    <div className="flex gap-4">
                      {"Good Morning, How can I help you?"}
                      <Speech text="Good Morning, How can I help you?" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
