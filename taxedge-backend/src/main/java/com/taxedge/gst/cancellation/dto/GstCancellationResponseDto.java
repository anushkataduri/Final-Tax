package com.taxedge.gst.cancellation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GstCancellationResponseDto {

    private String cancellationId;

    private String status;
}