import React from "react";
import Image from 'next/image'; 

const Footer = () => {
  return (
    <>
      <footer className="mb-0 text-center">
        <div className="d-flex align-items-center justify-content-center pb-5">
          <div className="col-md-6">
            <p className="mb-3 mb-md-0" style={{ fontSize: '1em' }}>
              Made with 🖤 by David & Gina & Viola
            </p>
            <a
              className="text-dark fs-4"
              href="https://github.com/IAMongmong/wp1121_Final"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="https://github.com/fluidicon.png"
                alt="GitHub Icon"
                width={24}
                height={24}
                className="mx-auto my-auto"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
