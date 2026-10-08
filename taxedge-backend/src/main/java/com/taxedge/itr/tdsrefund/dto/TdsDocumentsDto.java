package com.taxedge.itr.tdsrefund.dto;

import java.time.LocalDateTime;

import com.taxedge.itr.tdsrefund.entity.TdsDocuments;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TdsDocumentsDto {

	private Long id;
	private String tdsRefundId;

    private byte[] panFile;

   
    private byte[] form16File;

   
    private byte[] form16aFile;

    
    private byte[] aisFile;

   
    private byte[] tisFile;

   
    private byte[] bankStatementsFile;

   
    private byte[] prevItrFile;

   
    private byte[] tdsCertsFile;

   
    private byte[] incomeProofsFile;
}
