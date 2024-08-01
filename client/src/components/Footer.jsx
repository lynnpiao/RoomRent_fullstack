import { FaInstagram } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12 px-4 font-sans tracking-wide">
            <div className="text-center">
                <h6 className="text-base">Stay connected with me:</h6>

                <ul className="flex flex-wrap justify-center gap-x-8 gap-4 my-8">

                    <li><a href="https://github.com/lynnpiao" className="text-xl hover:text-gray-400">
                        <BsGithub/>
                    </a></li>

                    <li><a href="https://www.instagram.com/linpiao42/" className="text-xl hover:text-gray-400">
                        <FaInstagram /></a></li>
                </ul>

                <p className="text-base">&copy; 2024 Lin. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default Footer