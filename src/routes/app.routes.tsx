import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Hub from "../pages/hub";
type RootBottomTab = {
  Noticias: undefined;
  Hub: undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<RootBottomTab>();

export default function App_routes() {
  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "skyblue",
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
            case "Settings":
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
      <Screen name="Settings" component={Ex} />
    </Navigator>
  );
}

const Ex = () => <></>;
