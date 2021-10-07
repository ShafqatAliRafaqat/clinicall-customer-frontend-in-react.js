import React from 'react';
import * as Icon from "react-feather"


function Footer() {
    return (
        <footer className="page-footer font-small blue pt-2 footerBackground">
            <div className="footer-copyright text-center footerPadding">
                <div className="divider divider-light mb-0">
                    <div className="divider-text footerdivider">
                        <h2>
                            <span><Icon.Facebook size={30} className='mr-2 footerIcons' /></span>
                            <span><Icon.Twitter size={30} className='mr-2 footerIcons' /></span>
                            <span><Icon.Instagram size={30} className='mr-2 footerIcons' /></span>
                            <span><Icon.Linkedin size={30} className='mr-2 footerIcons' /></span>
                        </h2>
                    </div>
                </div>
            </div>
            <div className="footer-copyright text-center py-1">
                <p>Terms & Conditions | Privacy     </p>
                <p>Copyright <i className="far fa-copyright"></i> 2020 Clinic<b>Call</b></p>
            </div>
        </footer>
    )
}

export default Footer
