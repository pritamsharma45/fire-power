import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaWhatsapp, FaTelegram } from "react-icons/fa";

export default function ShareButtons({ url, title }) {
  return (
    <div className="flex justify-center space-x-4 mt-0">
      <FacebookShareButton
        url={url}
        quote={title}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        <FaFacebook className="mr-2" />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
        className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
      >
        <FaTwitter className="mr-2" />
      </TwitterShareButton>
      <WhatsappShareButton
        url={url}
        title={title}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
      >
        <FaWhatsapp className="mr-2" />
      </WhatsappShareButton>
      <TelegramShareButton
        url={url}
        title={title}
        className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
      >
        <FaTelegram className="mr-2" />
      </TelegramShareButton>
    </div>
  );
}
