import { FC, memo, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const HeaderSticky: FC<any> = ({ children }) => {
  const [sticky, setSticky] = useState("");
  const isSticky = () => {
    /* Method that will fix header after a specific scrollable */
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 160 ? "is-sticky" : "";
    setSticky(stickyClass);
  };
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  const classes = `menu_nav ${sticky}`;
  return <div className={classes}>{children}</div>;
};
// eslint-disable-next-line react-refresh/only-export-components
export default memo(HeaderSticky);
