import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Hub from "../pages/hub";

// Define os tipos de rotas para as tabs
type RootBottomTab = {
    News: undefined;
    Hub: undefined;
    Settings: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<RootBottomTab>();

export default function App_routes() {
    return (
        <Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false, // Não mostra rótulos
                tabBarActiveTintColor: "skyblue", // Cor da tab enquanto ativa
                tabBarIcon: ({ focused, color, size }) => {
                    switch (route.name) {
                        case "News":
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
            {/* Define as telas para cada tab */}
            <Screen name="News" component={Ex} />
            <Screen name="Hub" component={Hub} />
            <Screen name="Settings" component={Ex} />
        </Navigator>
    );
}

// Componente de exemplo
const Ex = () => <></>;
