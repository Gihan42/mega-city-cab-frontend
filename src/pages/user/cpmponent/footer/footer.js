import React, { useState, useEffect } from 'react';import { LocalPhone, MarkEmailUnread, LinkedIn, Instagram, Facebook } from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
function Footer() {
    const navigate = useNavigate();
    function logOut(){
        navigate('/');
    }

    return (
        <div className="carousel slide mt-32 w-full h-full" id="carouselExampleControlsNoTouching" data-bs-touch="false">
            <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">Mega City Cab</span>
            </div>
            <p className="text-gray-400">
              Your trusted taxi service in Colombo
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#reviews" className="text-gray-400 hover:text-white">
                  Reviews
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>info@megacitycab.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
            <p className="text-gray-400">
              24/7 Service Available
              <br />
              Always ready to serve you
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Mega City Cab. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
        </div>
    );
}

export default Footer;
