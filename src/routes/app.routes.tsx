import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Hub from "../pages/hub";
type RootBottomTab = {
  Noticias: undefined;
  Hub: undefined;
  Configuracao: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<RootBottomTab>();

export default function App_routes() {
  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "blue",
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "Noticias":
              return (
                <Ionicons
                  name={focused ? "newspaper" : "newspaper-outline"}
                  size={size}
                  color={color}
                />
              );
            case "Hub":
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
            case "Configuracao":
              return (
                <Ionicons
                  name={focused ? "cog" : "cog-outline"}
                  size={size}
                  color={color}
                />
              );
          }
        },
      })}
    >
      <Screen name="Noticias" component={Ex} />
      <Screen name="Hub" component={Hub} />
      <Screen name="Configuracao" component={Ex} />
    </Navigator>
  );
}

const Ex = () => <></>;
