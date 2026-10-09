import React, { useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { CompanySectionCard } from '../CompanySectionCard/CompanySectionCard';
import { styles } from './StepCapitalShareholding.styles';

export const StepCapitalShareholding: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const directors = useCompanyRegistrationStore((state) => state.draft.directors);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);
  const updateDirector = useCompanyRegistrationStore((state) => state.updateDirector);
  const fieldErrors = useCompanyRegistrationStore((state) => state.fieldErrors);

  const isOpc = company.companyType === 'One Person Company (OPC)';

  // Total subscribed shares across all shareholders
  const totalSubscribedShares = directors.reduce(
    (sum, d) => sum + (Number(d.numberOfShares) || 0),
    0
  );

  const faceValue = Number(company.faceValuePerShare) || 10;
  const authCapital = Number(company.authorizedCapital) || 0;
  const totalAuthShares = faceValue > 0 ? Math.floor(authCapital / faceValue) : 0;
  const derivedSubscribedCapital = totalSubscribedShares * faceValue;

  // Auto-update derived values in store
  useEffect(() => {
    updateDetails({
      numberOfShares: totalAuthShares,
      paidUpCapital: derivedSubscribedCapital,
    });
  }, [authCapital, faceValue, totalSubscribedShares]);

  // For OPC, automatically assign 100% shares to the single promoter
  useEffect(() => {
    if (isOpc && directors.length > 0 && totalAuthShares > 0) {
      if (directors[0].numberOfShares !== totalAuthShares) {
        updateDirector(directors[0].id, {
          numberOfShares: totalAuthShares,
          amountSubscribed: totalAuthShares * faceValue,
        });
      }
    }
  }, [isOpc, totalAuthShares, directors]);

  const handleShareAllocationChange = (dirId: string, sharesInput: string) => {
    const shares = Math.max(0, parseInt(sharesInput.replace(/\D/g, ''), 10) || 0);
    const amount = shares * faceValue;
    updateDirector(dirId, {
      numberOfShares: shares,
      amountSubscribed: amount,
    });
  };

  const getSharePercentageStr = (shares: number | undefined): string => {
    if (isOpc) return '100%';
    if (!shares || !totalSubscribedShares || totalSubscribedShares <= 0) return '--';
    const pct = (Number(shares) / totalSubscribedShares) * 100;
    if (isNaN(pct)) return '--';
    return pct % 1 === 0 ? `${pct.toFixed(0)}%` : `${pct.toFixed(1)}%`;
  };

  const isCapitalValid = authCapital > 0 && derivedSubscribedCapital <= authCapital;
  const isFaceValueValid = faceValue > 0;
  const isShareholdingValid =
    isOpc || (totalSubscribedShares > 0 && (totalAuthShares === 0 || totalSubscribedShares <= totalAuthShares));
  const isAllValid = isCapitalValid && isFaceValueValid && isShareholdingValid;

  return (
    <View style={styles.container}>
      {/* Capital Details */}
      <CompanySectionCard
        title="Capital Details"
        description="Define authorized capital, face value, and view derived subscribed capital."
      >
        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Authorised Capital (₹) *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.authorizedCapital && styles.inputError]}
              value={company.authorizedCapital ? String(company.authorizedCapital) : ''}
              onChangeText={(val) => updateDetails({ authorizedCapital: Number(val) || 0 })}
              keyboardType="numeric"
              placeholder="e.g. 100000"
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.authorizedCapital && <Text style={styles.errorText}>{fieldErrors.authorizedCapital}</Text>}
          </View>

          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Face Value per Share (₹) *</Text>
            <TextInput
              style={[styles.input, !!fieldErrors.faceValuePerShare && styles.inputError]}
              value={company.faceValuePerShare ? String(company.faceValuePerShare) : ''}
              onChangeText={(val) => updateDetails({ faceValuePerShare: Number(val) || 0 })}
              keyboardType="numeric"
              placeholder="e.g. 10"
              placeholderTextColor="#94A3B8"
            />
            {!!fieldErrors.faceValuePerShare && <Text style={styles.errorText}>{fieldErrors.faceValuePerShare}</Text>}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Authorised Shares (Calculated)</Text>
            <View style={styles.readOnlyInput}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#263238' }}>
                {totalAuthShares ? totalAuthShares.toLocaleString() : '0'} shares
              </Text>
            </View>
          </View>

          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Subscribed Capital (Calculated)</Text>
            <View style={styles.readOnlyInput}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#263238' }}>
                ₹{derivedSubscribedCapital ? derivedSubscribedCapital.toLocaleString('en-IN') : '0'}
              </Text>
            </View>
          </View>
        </View>
      </CompanySectionCard>

      {/* Shareholding Pattern */}
      <CompanySectionCard title="Shareholding Pattern">
        {isOpc && (
          <Text style={styles.opcNote}>
            In a One Person Company (OPC), 100% equity shareholding is automatically allocated to the single member.
          </Text>
        )}

        {directors.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="people-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>
              No promoter/share subscription details added yet.
            </Text>
          </View>
        ) : (
          <>
            {directors.map((dir, idx) => {
              const allocatedShares = dir.numberOfShares || 0;
              const allocatedAmount = allocatedShares * faceValue;
              return (
                <View key={dir.id || `dir-${idx}`} style={styles.shareCard}>
                  <View style={styles.shareRow}>
                    <View style={styles.shareInfo}>
                      <Text style={styles.shareName}>
                        {dir.name || `Promoter / Director #${idx + 1}`}
                      </Text>
                      <Text style={styles.shareDetailText}>
                        PAN: {dir.pan || 'N/A'} • Subscribed Amount: ₹{allocatedAmount.toLocaleString('en-IN')}
                      </Text>
                    </View>

                    <View style={styles.shareStatsRight}>
                      <View style={styles.shareBadge}>
                        <Text style={styles.shareBadgeText}>
                          {getSharePercentageStr(dir.numberOfShares)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {!isOpc && (
                    <View style={styles.shareInputRow}>
                      <View style={styles.halfField}>
                        <Text style={styles.shareInputLabel}>Allocated Shares *</Text>
                        <TextInput
                          style={styles.smallInput}
                          value={dir.numberOfShares ? String(dir.numberOfShares) : ''}
                          onChangeText={(val) => handleShareAllocationChange(dir.id, val)}
                          keyboardType="numeric"
                          placeholder="Enter shares"
                          placeholderTextColor="#94A3B8"
                        />
                      </View>
                      <View style={styles.halfField}>
                        <Text style={styles.shareInputLabel}>Amount (Calculated)</Text>
                        <View style={[styles.smallInput, { backgroundColor: '#F8FAFC' }]}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: '#263238' }}>
                            ₹{allocatedAmount.toLocaleString('en-IN')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Dynamic Totals Summary */}
            <View style={styles.totalsCard}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Total Subscribed Shares</Text>
                <Text style={styles.totalsValue}>
                  {totalSubscribedShares ? totalSubscribedShares.toLocaleString() : '0'}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Total Share Allocation</Text>
                <Text style={styles.totalsValue}>
                  {isOpc || totalSubscribedShares > 0 ? '100%' : '--'}
                </Text>
              </View>
            </View>
          </>
        )}

        {!!fieldErrors.shareholdingTotal && (
          <Text style={[styles.errorText, { marginBottom: 12 }]}>{fieldErrors.shareholdingTotal}</Text>
        )}

        {/* Dynamic Validation Status */}
        <View
          style={[
            styles.validationBox,
            isAllValid ? styles.validBox : styles.invalidBox,
          ]}
        >
          <Ionicons
            name={isAllValid ? 'checkmark-circle' : 'alert-circle'}
            size={20}
            color={isAllValid ? '#166534' : '#991B1B'}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.validationText, { color: isAllValid ? '#166534' : '#991B1B' }]}>
              Subscribed Capital ≤ Authorised Capital:{' '}
              {isCapitalValid ? 'PASSED' : 'FAILED (Subscribed exceeds Authorised)'}
            </Text>
            <Text style={[styles.validationText, { color: isAllValid ? '#166534' : '#991B1B' }]}>
              Total Share Allocation:{' '}
              {isShareholdingValid
                ? '100% (PASSED)'
                : totalSubscribedShares > totalAuthShares
                ? 'FAILED (Subscribed exceeds Authorised)'
                : 'FAILED (No shares allocated yet)'}
            </Text>
          </View>
        </View>
      </CompanySectionCard>
    </View>
  );
};

export default StepCapitalShareholding;
