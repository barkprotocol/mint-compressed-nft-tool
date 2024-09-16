import Providers from "./providers/Providers";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App() {
  return (
    <Providers>
      <Header />
      <Main />
      <Footer />
    </Providers>
  );
}

export default App;
