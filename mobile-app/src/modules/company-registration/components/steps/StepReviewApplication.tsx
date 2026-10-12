import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { CompanySectionCard } from '../CompanySectionCard/CompanySectionCard';
import { styles } from './StepReviewApplication.styles';

export const StepReviewApplication: React.FC = () => {
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const startEditingStep = useCompanyRegistrationStore((state) => state.startEditingStep);
  const { company, directors } = draft;

  const primaryDirector = directors[0] || {};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review Application</Text>
      <Text style={styles.subheading}>Review your application details thoroughly before proceeding to payment.</Text>

      {/* 1. Company Type & Classification */}
      <CompanySectionCard
        iconName="layers-outline"
        title="Company Type & Classification"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(0)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Company Type</Text><Text style={styles.dataValue}>{company.companyType || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Class of Company</Text><Text style={styles.dataValue}>{company.companyClass || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Category of Company</Text><Text style={styles.dataValue}>{company.companyCategory || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Sub-Category of Company</Text><Text style={styles.dataValue}>{company.companySubCategory || ''}</Text></View>
      </CompanySectionCard>

      {/* 2. Business Activity & NIC */}
      <CompanySectionCard
        iconName="briefcase-outline"
        title="Business Activity & NIC"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(1)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Primary Business Activity</Text><Text style={styles.dataValue}>{company.primaryActivity || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>NIC 5-Digit Code</Text><Text style={styles.dataValue}>{company.nicCode || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Secondary Business Activity</Text><Text style={styles.dataValue}>{company.secondaryActivity || ''}</Text></View>
      </CompanySectionCard>

      {/* 3. Proposed Company Names */}
      <CompanySectionCard
        iconName="text-outline"
        title="Proposed Company Names"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(1)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>First Preferred Name</Text><Text style={styles.dataValue}>{company.proposedName1 || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Second Preferred Name</Text><Text style={styles.dataValue}>{company.proposedName2 || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Mandatory Suffix</Text><Text style={styles.dataValue}>{company.nameSuffix || ''}</Text></View>
      </CompanySectionCard>

      {/* 4. Registered Office Details */}
      <CompanySectionCard
        iconName="location-outline"
        title="Registered Office Details"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(2)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Building / Address Line</Text><Text style={styles.dataValue}>{company.registeredAddressLine || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>City</Text><Text style={styles.dataValue}>{company.registeredCity || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>District</Text><Text style={styles.dataValue}>{company.registeredDistrict || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>State</Text><Text style={styles.dataValue}>{company.registeredState || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>PIN Code</Text><Text style={styles.dataValue}>{company.registeredPincode || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Premises Ownership Status</Text><Text style={styles.dataValue}>{company.premisesOwnership || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Company Email</Text><Text style={styles.dataValue}>{company.companyEmail || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Company Mobile</Text><Text style={styles.dataValue}>{company.companyMobile || ''}</Text></View>
      </CompanySectionCard>

      {/* 5. Promoter / Director Details */}
      <CompanySectionCard
        iconName="people-outline"
        title="Promoter / Director Details"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(3)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Full Name (as in PAN)</Text><Text style={styles.dataValue}>{primaryDirector.name || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>PAN Number</Text><Text style={styles.dataValue}>{primaryDirector.pan || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>DIN (if allotted)</Text><Text style={styles.dataValue}>{primaryDirector.din || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Date of Birth</Text><Text style={styles.dataValue}>{primaryDirector.dob || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Father's Name</Text><Text style={styles.dataValue}>{primaryDirector.fatherName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Gender</Text><Text style={styles.dataValue}>{primaryDirector.gender || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Nationality</Text><Text style={styles.dataValue}>{primaryDirector.nationality || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Designation</Text><Text style={styles.dataValue}>{primaryDirector.designation || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Category</Text><Text style={styles.dataValue}>{primaryDirector.category || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Email Address</Text><Text style={styles.dataValue}>{primaryDirector.email || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Mobile Number</Text><Text style={styles.dataValue}>{primaryDirector.phone || ''}</Text></View>
      </CompanySectionCard>

      {/* 6. Capital & Shareholding */}
      <CompanySectionCard
        iconName="cash-outline"
        title="Capital & Shareholding"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(4)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Authorised Capital</Text><Text style={styles.dataValue}>{company.authorizedCapital ? `₹${company.authorizedCapital.toLocaleString('en-IN')}` : ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Subscribed Capital</Text><Text style={styles.dataValue}>{company.paidUpCapital ? `₹${company.paidUpCapital.toLocaleString('en-IN')}` : ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Total Number of Shares</Text><Text style={styles.dataValue}>{company.numberOfShares ? String(company.numberOfShares) : ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Face Value per Share</Text><Text style={styles.dataValue}>{company.faceValuePerShare ? `₹${company.faceValuePerShare}` : ''}</Text></View>
      </CompanySectionCard>

      {/* 7. Documents & KYC Checklist */}
      <CompanySectionCard
        iconName="document-attach-outline"
        title="Documents & KYC Checklist"
        headerRight={
          <TouchableOpacity onPress={() => startEditingStep(5)} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Promoter PAN Card</Text><Text style={styles.dataValue}>{draft.documents?.find(d => d.id === 'doc-pan')?.fileName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Identity / Address Proof</Text><Text style={styles.dataValue}>{draft.documents?.find(d => d.id === 'doc-aadhaar')?.fileName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Passport Photo</Text><Text style={styles.dataValue}>{draft.documents?.find(d => d.id === 'doc-photo')?.fileName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Office Address Proof</Text><Text style={styles.dataValue}>{company.officeAddressProofName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Office Utility Bill</Text><Text style={styles.dataValue}>{draft.documents?.find(d => d.id === 'doc-utility')?.fileName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Ownership / Lease Document</Text><Text style={styles.dataValue}>{company.ownershipDocName || ''}</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Owner NOC</Text><Text style={styles.dataValue}>{company.ownerNocName || ''}</Text></View>
      </CompanySectionCard>
    </View>
  );
};

export default StepReviewApplication;
