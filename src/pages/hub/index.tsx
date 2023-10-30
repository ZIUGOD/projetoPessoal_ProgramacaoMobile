// Importações das bibliotecas necessárias
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, VirtualizedList, Text } from "react-native";
import Slider from "@react-native-community/slider";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define o tipo de objeto para representar as Coins
type CoinType = {
    id: number;
    name: string;
    symbol: string;
    quote: {
        USD: {
            price: number;
            volume_change_24h: number;
            percent_change_1h: number;
            percent_change_24h: number;
            percent_change_7d: number;
        };
    };
};

// Componente de item que representa uma moeda
function Item({ item }: { item: CoinType }) {
    const [detalhes, setDetalhes] = useState(false);

    return (
        <TouchableOpacity
            onPress={() => setDetalhes(!detalhes)}

            // background das infos de cada criptoCoin
            style={{
                backgroundColor: "#ffffff",
                justifyContent: 'center',
                padding: 12,
                borderRadius: 12,
                gap: 4,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text style={{
                        fontWeight: "200"
                    }}>
                        <Text
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            {item.symbol}
                        </Text>{" "}
                        - {item.name}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    {/* Ícone de tendência com base na mudança percentual das últimas 1 hora */}
                    <Ionicons
                        name={
                            item.quote.USD.percent_change_1h === 0
                                ? "flag"
                                : item.quote.USD.percent_change_1h > 0
                                    ? "trending-up"
                                    : "trending-down"
                        }
                        size={16}
                        color={
                            item.quote.USD.percent_change_1h === 0
                                ? "#F5A00B"
                                : item.quote.USD.percent_change_1h > 0
                                    ? "green"
                                    : "red"
                        }
                    />
                    {/* Mudança percentual das últimas 1 hora */}
                    <Text
                        style={{
                            color:
                                item.quote.USD.percent_change_1h === 0
                                    ? "#F5A00B"
                                    : item.quote.USD.percent_change_1h > 0
                                        ? "green"
                                        : "red",
                            fontWeight: "300",
                            fontSize: 12,
                        }}
                    >
                        {item.quote.USD.percent_change_1h.toLocaleString("pt-BR", {
                            style: "percent",
                        })}
                    </Text>

                    {/* Preço em USD */}
                    <Text
                        style={{
                            fontWeight: "900",
                            color: "black",
                        }}
                    >
                        {item.quote.USD.price.toLocaleString("pt-BR", {
                            currency: "USD",
                            style: "currency",
                        })}
                    </Text>
                </View>
            </View>
            <View style={{
                display: detalhes ? "flex" : "none",
            }}
            >
                {/* Volume das últimas 24 horas */}
                <Text style={{
                    fontWeight: "300"
                }}>
                    Volume 24h:{" "}
                    {item.quote.USD.volume_change_24h.toLocaleString("pt-BR", {
                        currency: "USD",
                        style: "currency",
                    })}
                </Text>
                {/* Mudança percentual das últimas 24 horas */}
                <Text style={{
                    fontWeight: "300"
                }}>
                    Variation 24h:{" "}
                    {item.quote.USD.percent_change_24h.toLocaleString("pt-BR", {
                        style: "percent",
                    })}
                </Text>
                {/* Mudança percentual das últimas 7 dias */}
                <Text style={{
                    fontWeight: "300"
                }}>
                    Variation 7d: {""}
                    {item.quote.USD.percent_change_7d.toLocaleString("pt-BR", {
                        style: "percent",
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// Função para renderizar um item da lista
function renderItem({ item }: { item: CoinType }) {
    return <Item item={item} />;
}

// Componente principal que busca e exibe a lista de Coins
export default function Hub() {
    const [Coins, setCoins] = useState<CoinType[]>([]);
    const [coinCount, setCoinCount] = useState<number>(10); // Defina o tipo como número

    const getData = async () => {
        try {
            const response = await api.get("/v1/cryptocurrency/listings/latest");
            const { data }: { data: CoinType[] } = response.data;

            // Limitar o número de moedas exibidas com base no valor de coinCount
            const limitedData = data.slice(0, coinCount);

            setCoins(limitedData);

            // Armazene os dados localmente usando AsyncStorage
            await AsyncStorage.setItem("coinsData", JSON.stringify(limitedData));
        } catch (error) {
            // Em caso de erro, tente recuperar os dados armazenados localmente
            const storedData = await AsyncStorage.getItem("coinsData");
            if (storedData) {
                setCoins(JSON.parse(storedData));
            } else {
                setCoins([]); // Caso não haja dados locais, limpe a lista
            }
        }
    }

    useEffect(() => {
        getData();
    }, [coinCount]); // Atualize os dados quando coinCount muda

    return (
        <View>
            {/* Controle deslizante para selecionar a quantidade de moedas */}
            <Slider
                style={{ width: 300 }}
                minimumValue={10}
                maximumValue={100}
                step={1}
                value={coinCount}
                onValueChange={(value) => setCoinCount(value)}
                thumbTintColor="#FF5733" // Cor do botão deslizante
                minimumTrackTintColor="#FF5733" // Cor da trilha à esquerda
                maximumTrackTintColor="#C0C0C0" // Cor da trilha à direita
            />

            <Text>Mostrar {coinCount} moedas</Text>
            <VirtualizedList
                data={Coins}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                getItemCount={() => Coins.length}
                getItem={(data, index) => data[index]}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            height: 0,
                            backgroundColor: "#ddd",
                            marginVertical: 10,
                            alignSelf: "center",
                            width: "10%",
                        }}
                    />
                )}
                refreshing={false}
                onRefresh={() => getData()} // Função para recarregar os dados ao puxar para baixo
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                }}
            />
        </View>
    );
}