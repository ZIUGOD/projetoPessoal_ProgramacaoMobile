import { useEffect, useState } from "react";
import { TouchableOpacity, View, VirtualizedList, Text } from "react-native";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";

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

function Item({ item }: { item: MoedaType }) {
  const [detalhes, setDetalhes] = useState(false);
  return (
    <TouchableOpacity
      onLongPress={() => setDetalhes(!detalhes)}
      style={{
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        gap: 10,
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
            fontWeight: "300"
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
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {item.quote.USD.price.toLocaleString("pt-BR", {
              currency: "BRL",
              style: "currency",
            })}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: detalhes ? "flex" : "none",
        }}
      >
        <Text style={{
          fontWeight: "300"
        }}>
          Volume 24h:{" "}
          {item.quote.USD.volume_change_24h.toLocaleString("pt-BR", {
            currency: "BRL",
            style: "currency",
          })}
        </Text>
        <Text style={{
          fontWeight: "300"
        }}>
          Variação 24h:{" "}
          {item.quote.USD.percent_change_24h.toLocaleString("pt-BR", {
            style: "percent",
          })}
        </Text>
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

function renderItem({ item }: { item: MoedaType }) {
  return <Item item={item} />;
}

export default function Hub() {
  const [moedas, setMoedas] = useState<MoedaType[]>([]);

  const getData = async () => {
    await api
      .get("/v1/cryptocurrency/listings/latest")
      .then((response) => {
        const { data }: { data: any[] } = response.data;

        setMoedas(data);
      })
      .catch((error) => {
        setMoedas([]);
      });
  };

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
      onRefresh={() => getData()}
      style={{
        paddingHorizontal: 20,
        paddingTop: 10,
      }}
    />
  );
}
