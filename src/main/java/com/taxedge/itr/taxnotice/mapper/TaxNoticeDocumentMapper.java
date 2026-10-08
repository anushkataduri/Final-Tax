package com.taxedge.itr.taxnotice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.taxedge.itr.taxnotice.dto.TaxNoticeDocumentDto;
import com.taxedge.itr.taxnotice.entity.TaxNoticeDocument;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TaxNoticeDocumentMapper {

	@Mapping(target = "documentId", ignore = true)
	@Mapping(target = "taxNoticeAssistance", ignore = true)
	TaxNoticeDocument toEntity(TaxNoticeDocumentDto dto);

	@Mapping(target = "documentId", ignore = true)
	@Mapping(target = "taxNoticeAssistance", ignore = true)
	void updateEntity(TaxNoticeDocumentDto dto, @MappingTarget TaxNoticeDocument document);

	@Mapping(target = "noticeId", source = "taxNoticeAssistance.noticeId")
	TaxNoticeDocumentDto toDto(TaxNoticeDocument document);
}