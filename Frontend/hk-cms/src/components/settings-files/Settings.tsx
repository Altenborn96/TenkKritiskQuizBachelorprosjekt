import React, { useState } from "react";
import "../../css/settings/SettingsNavBar.css";
import Terms from "./Terms.tsx";
import AboutUs from "./AboutUs.tsx";
import Privacy from "./Privacy.tsx";
import FAQ from "./FAQ.tsx";
import Sources from "./Sources.tsx";

const TermsComponent = () => (
  <>
    <Terms />
  </>
);
const AboutUsComponent = () => (
  <div>
    <AboutUs />
  </div>
);
const PrivacyComponent = () => (
  <>
    <Privacy />
  </>
);
const FAQComponent = () => (
  <>
    <FAQ />
  </>
);
const SourcesComponent = () => (
  <>
    <Sources />
  </>
);
const Settings = () => {
  const [activeComponent, setActiveComponent] = useState("privacy");

  return (
    <div>
      {/* Navbar */}
      <div>
        <nav className="settings-navbar">
          <ul>
            <li>
              <p
                className="settings-navbar-text"
                onClick={() => setActiveComponent("terms")}
              >
                Begreper
              </p>
            </li>
            <li>
              <p
                className="settings-navbar-text"
                onClick={() => setActiveComponent("sources")}
              >
                Kilder
              </p>
            </li>
            <li>
              <p
                className="settings-navbar-text"
                onClick={() => setActiveComponent("faq")}
              >
                FAQ
              </p>
            </li>
            <li>
              <p
                className="settings-navbar-text"
                onClick={() => setActiveComponent("aboutus")}
              >
                Om oss
              </p>
            </li>
            <li>
              <p
                className="settings-navbar-text"
                onClick={() => setActiveComponent("privacy")}
              >
                Personvern
              </p>
            </li>
          </ul>
        </nav>
      </div>
      {/* Navbar */}

      {activeComponent === "terms" && <TermsComponent />}
      {activeComponent === "privacy" && <PrivacyComponent />}
      {activeComponent === "sources" && <SourcesComponent />}
      {activeComponent === "faq" && <FAQComponent />}
      {activeComponent === "aboutus" && <AboutUsComponent />}
    </div>
  );
};

export default Settings;
