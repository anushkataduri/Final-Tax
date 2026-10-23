import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ServiceHeader } from "@/shared/components/ServiceHeader";
import { ServiceList } from "@/shared/components/ServiceList";
import { useServiceAccessGuard } from "@/shared/hooks";
import { itrService } from "../../services/itrService";
import { ItrServiceItem } from "../../types/itr.types";
import { styles } from "./ItrScreen.styles";

export const ItrScreen: React.FC = () => {
  const { accessService } = useServiceAccessGuard();
  const [services, setServices] = useState<ItrServiceItem[]>([]);

  useEffect(() => {
    itrService.fetchItrServices().then(setServices);
  }, []);

  const handleCardPress = (item: ItrServiceItem) => {
    if (item.route) {
      accessService(item.route as unknown as Parameters<typeof accessService>[0]);
    }
  };

  return (
    <View style={styles.container}>
      <ServiceHeader
        title="Income Tax"
        subtitle="File your income tax return accurately with certified CA assistance and maximize your refund."
        tag="Tax Services"
        iconName="calculator"
      />
      <ServiceList items={services} onItemPress={handleCardPress} />
    </View>
  );
};

export default ItrScreen;
