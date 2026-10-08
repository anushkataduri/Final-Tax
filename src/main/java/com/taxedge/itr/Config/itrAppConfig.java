package com.taxedge.itr.Config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class itrAppConfig {
    
	@Bean("itrModelMapper")
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
