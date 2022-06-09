import { NavMenu } from "./NavMenu"
import ProfileMenu from "./ProfileMenu"


type HeaderProps = {
    setMenuOpen: () => void
}


function Header({setMenuOpen}: HeaderProps) {

    return (
        <nav className="text-white border-gray-200 px-2 sm:px-4 flex h-14 bg-[#06DD83]">
            <div className="container flex flex-wrap justify-end md:justify-between items-center mx-auto">

                <ProfileMenu setMenuOpen={setMenuOpen} />
                <NavMenu />

            </div>
        </nav>
    )

}

export default Header
