import { NavigationContainer } from '@react-navigation/native';
import App_routes from './src/routes/app.routes';

export default function App() {
  return (
    <NavigationContainer>
      <App_routes />
    </NavigationContainer>
  );
}