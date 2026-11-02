package com.taxedge.dashboards.auth.service;

import java.util.List;

import com.taxedge.dashboards.auth.dto.ManagerLoginDto;
import com.taxedge.dashboards.auth.enums.ManagerRole;

/**
 * Service interface for manager accounts: the administrator creates, lists,
 * updates and deletes them. Managers sign in through LoginService.
 */
public interface ManagerLoginService {

    ManagerLoginDto createManager(ManagerLoginDto managerLoginDto);

    /** All managers A–Z, or only one role's when role is not null. */
    List<ManagerLoginDto> getManagers(ManagerRole role);

    ManagerLoginDto getManagerById(Long id);


    /** A blank password keeps the current one. */
    ManagerLoginDto updateManager(Long id, ManagerLoginDto managerLoginDto);

    void deleteManager(Long id);

}
