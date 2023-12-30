"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useNavigation } from "next/navigation";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  // const navigation = useNavigation();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand fw-bold fs-4 px-2">As Vegas</a>
        </Link>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <Link href="/">
                <a
                  className={`nav-link ${
                    navigation.pathname === "/" ? "active" : ""
                  }`}
                >
                  Home
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/product">
                <a
                  className={`nav-link ${
                    navigation.pathname === "/product" ? "active" : ""
                  }`}
                >
                  Products
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about">
                <a
                  className={`nav-link ${
                    navigation.pathname === "/about" ? "active" : ""
                  }`}
                >
                  About
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact">
                <a
                  className={`nav-link ${
                    navigation.pathname === "/contact" ? "active" : ""
                  }`}
                >
                  Contact
                </a>
              </Link>
            </li>
          </ul>
          <div className="buttons text-center">
            <Link href="/login">
              <a className="btn btn-outline-dark m-2">
                <i className="fa fa-sign-in-alt mr-1"></i> Login
              </a>
            </Link>
            <Link href="/register">
              <a className="btn btn-outline-dark m-2">
                <i className="fa fa-user-plus mr-1"></i> Register
              </a>
            </Link>
            <Link href="/cart">
              <a className="btn btn-outline-dark m-2">
                <i className="fa fa-cart-shopping mr-1"></i> Cart (
                {state.length})
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
