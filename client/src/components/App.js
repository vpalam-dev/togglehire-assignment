import { Provider } from "urql";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { client } from "../client";
import { Questions } from "./Questions";

export function App() {
  return (
    <Provider value={client}>
      <CssBaseline />
      <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }} fixed>
        <Questions />
      </Container>
    </Provider>
  );
}
