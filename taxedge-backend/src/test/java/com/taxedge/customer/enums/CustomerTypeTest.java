package com.taxedge.customer.enums;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;

public class CustomerTypeTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testCustomerTypeDeserialization() throws Exception {
        // Test all 10 frontend UI options
        assertEquals(CustomerType.INDIVIDUAL, objectMapper.readValue("\"Individual\"", CustomerType.class));
        assertEquals(CustomerType.PROPRIETORSHIP, objectMapper.readValue("\"Proprietorship\"", CustomerType.class));
        assertEquals(CustomerType.PARTNERSHIP, objectMapper.readValue("\"Partnership\"", CustomerType.class));
        assertEquals(CustomerType.LLP, objectMapper.readValue("\"LLP\"", CustomerType.class));
        assertEquals(CustomerType.PRIVATE_LIMITED, objectMapper.readValue("\"Private Limited\"", CustomerType.class));
        assertEquals(CustomerType.PUBLIC_LIMITED, objectMapper.readValue("\"Public Limited\"", CustomerType.class));
        assertEquals(CustomerType.HUF, objectMapper.readValue("\"HUF\"", CustomerType.class));
        assertEquals(CustomerType.AOP_BOI, objectMapper.readValue("\"AOP / BOI\"", CustomerType.class));
        assertEquals(CustomerType.FREELANCER, objectMapper.readValue("\"Freelancer\"", CustomerType.class));
        assertEquals(CustomerType.NGO_TRUST, objectMapper.readValue("\"NGO / Trust\"", CustomerType.class));

        // Test exact enum name strings
        assertEquals(CustomerType.AOP_BOI, objectMapper.readValue("\"AOP_BOI\"", CustomerType.class));
        assertEquals(CustomerType.NGO_TRUST, objectMapper.readValue("\"NGO_TRUST\"", CustomerType.class));
        assertEquals(CustomerType.PUBLIC_LIMITED, objectMapper.readValue("\"PUBLIC_LIMITED\"", CustomerType.class));
        assertEquals(CustomerType.PRIVATE_LIMITED, objectMapper.readValue("\"PRIVATE_LIMITED\"", CustomerType.class));
        assertEquals(CustomerType.FREELANCER, objectMapper.readValue("\"FREELANCER\"", CustomerType.class));
    }

    @Test
    public void testGenderDeserialization() throws Exception {
        assertEquals(Gender.MALE, objectMapper.readValue("\"Male\"", Gender.class));
        assertEquals(Gender.FEMALE, objectMapper.readValue("\"Female\"", Gender.class));
        assertEquals(Gender.OTHER, objectMapper.readValue("\"Other\"", Gender.class));
    }
}
