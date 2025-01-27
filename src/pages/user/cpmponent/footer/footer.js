import React, { useState, useEffect } from 'react';import { LocalPhone, MarkEmailUnread, LinkedIn, Instagram, Facebook } from '@mui/icons-material';
import {useNavigate} from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    function logOut(){
        navigate('/');
    }

    return (
        <div className="carousel slide w-full h-full" id="carouselExampleControlsNoTouching" data-bs-touch="false">
            <footer
                className="text-center text-lg-start text-white"
                style={{ backgroundColor: '#0A2136', width: '100%' }}
            >
                <div className="container-fluid p-4 pb-0">
                    <section>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase">FOOTER CONTENT</h5>

                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Molestiae modi cum ipsam ad, illo possimus laborum ut
                                    reiciendis obcaecati. Ducimus, quas. Corrupti, pariatur eaque?
                                    Reiciendis assumenda iusto sapiente inventore animi?
                                </p>
                            </div>

                            <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase">Links</h5>

                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <a href="#!" className="text-white">Link 1</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 2</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 3</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 4</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase">Links</h5>

                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <a href="#!" className="text-white">Link 1</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 2</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 3</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 4</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase">Links</h5>

                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <a href="#!" className="text-white">Link 1</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 2</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 3</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 4</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
                                <h5 className="text-uppercase">Links</h5>

                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <a href="#!" className="text-white">Link 1</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 2</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 3</a>
                                    </li>
                                    <li>
                                        <a href="#!" className="text-white">Link 4</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="mb-4" />

                    <section>
                        <p className="d-flex justify-content-center align-items-center">
                            <span className="me-3">Good bye</span>
                            <button type="button" className="btn btn-outline-light btn-rounded" onClick={logOut}>
                                Sign out!
                            </button>
                        </p>
                    </section>

                    <hr className="mb-4" />

                    <section className="mb-4 text-center">
                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
                            <LinkedIn/>
                        </a>

                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
                            <Facebook/>
                        </a>

                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
                            <Instagram/>
                        </a>

                    </section>
                </div>

                <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    © 2020 Copyright:
                    <a className="text-white" href="https://mdbootstrap.com/">
                        gihan.com
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
