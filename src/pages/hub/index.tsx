// Importações das bibliotecas necessárias
import { useEffect, useState } from "react";
import { TouchableOpacity, View, VirtualizedList, Text } from "react-native";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

// Define o tipo de objeto para representar as moedas
type MoedaType = {
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
function Item({ item }: { item: MoedaType }) {
    const [detalhes, setDetalhes] = useState(false);

    return (
        <TouchableOpacity
            onLongPress={() => setDetalhes(!detalhes)}

            // background das infos de cada criptomoeda
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
                        </Text>{"olá"}
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
                            fontWeight: "bold",
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
                    Variação 24h:{" "}
                    {item.quote.USD.percent_change_24h.toLocaleString("pt-BR", {
                        style: "percent",
                    })}
                </Text>
                {/* Mudança percentual das últimas 7 dias */}
                <Text style={{
                    fontWeight: "300"
                }}>
                    Variação 7d:{" "}
                    {item.quote.USD.percent_change_7d.toLocaleString("pt-BR", {
                        style: "percent",
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// Função para renderizar um item da lista
function renderItem({ item }: { item: MoedaType }) {
    return <Item item={item} />;
}

// Componente principal que busca e exibe a lista de moedas
export default function Hub() {
    const [moedas, setMoedas] = useState<MoedaType[]>([]);

    // Função para buscar dados da API quando o componente é montado
    const getData = async () => {
        try {
            const response = await api.get("/v1/cryptocurrency/listings/latest");
            const { data }: { data: MoedaType[] } = response.data;

            setMoedas(data);
        } catch (error) {
            setMoedas([]); // Limpa a lista em caso de erro
        }
    };

    // Chamada para buscar dados quando o componente é montado
    useEffect(() => {
        getData();
    }, []);

    return (
        <VirtualizedList
            data={moedas}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            getItemCount={() => moedas.length}
            getItem={(data, index) => data[index]}
            ItemSeparatorComponent={() => (
                <View
                    style={{
                        height: 1,
                        backgroundColor: "#ddd",
                        marginVertical: 10,
                        alignSelf: "center",
                        width: "60%",
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
    );
}
