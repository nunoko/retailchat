import React from "react";

const AppContext = React.createContext();
const Provider = AppContext.Provider;
const Consumer = AppContext.Consumer;

export { Provider };
export { Consumer };
export default AppContext;
